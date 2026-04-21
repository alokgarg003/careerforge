import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';

// POST /api/jobs/search - AI-powered job search via web search
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, location, numResults = 10 } = body;

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    // Build search query optimized for job finding
    const searchQuery = location
      ? `${query} jobs ${location} site:linkedin.com OR site:naukri.com OR site:indeed.com`
      : `${query} jobs India site:linkedin.com OR site:naukri.com OR site:indeed.com`;

    const zai = await ZAI.create();

    // Step 1: Web Search
    const searchResults = await zai.functions.invoke('web_search', {
      query: searchQuery,
      num: numResults,
    });

    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      return NextResponse.json({
        success: true,
        results: [],
        message: 'No job listings found. Try different keywords.',
      });
    }

    // Step 2: Read top 5 pages for details
    const detailedJobs = [];
    const maxRead = 5;

    for (let i = 0; i < Math.min(searchResults.length, maxRead); i++) {
      const r = searchResults[i];
      try {
        const pageData = await zai.functions.invoke('page_reader', { url: r.url });
        const html = pageData?.data?.html || '';
        const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        detailedJobs.push({
          title: r.name || pageData?.data?.title || 'Unknown',
          url: r.url,
          source: new URL(r.url).hostname.replace('www.', ''),
          snippet: r.snippet,
          description: text.substring(0, 3000),
          datePosted: pageData?.data?.publishedTime || r.date || new Date().toISOString(),
        });
      } catch {
        detailedJobs.push({
          title: r.name,
          url: r.url,
          source: new URL(r.url).hostname.replace('www.', ''),
          snippet: r.snippet,
          description: r.snippet,
          datePosted: r.date || new Date().toISOString(),
        });
      }
    }

    for (let i = maxRead; i < searchResults.length; i++) {
      const r = searchResults[i];
      detailedJobs.push({
        title: r.name,
        url: r.url,
        source: new URL(r.url).hostname.replace('www.', ''),
        snippet: r.snippet,
        description: r.snippet,
        datePosted: r.date || new Date().toISOString(),
      });
    }

    // Step 3: LLM extract structured data
    const prompt = `You are a job data extractor. Given job listings, extract structured data. Return a JSON array. Each item: title, companyName, location, description, skills (array), experienceRange, workMode (Remote/Hybrid/Onsite).

Listings: ${JSON.stringify(detailedJobs.slice(0, 5), null, 2)}

Return ONLY valid JSON array. No markdown.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'You extract structured data. Return only valid JSON.' },
        { role: 'user', content: prompt },
      ],
      thinking: { type: 'disabled' },
    });

    let extractedJobs;
    try {
      const text = completion.choices[0]?.message?.content || '[]';
      const match = text.match(/\[[\s\S]*\]/);
      extractedJobs = JSON.parse(match ? match[0] : text);
    } catch {
      extractedJobs = detailedJobs.map(j => ({
        title: j.title,
        companyName: 'Unknown',
        location: location || 'India',
        description: j.description,
        skills: [],
        experienceRange: '',
        workMode: 'Onsite',
      }));
    }

    // Step 4: Score against profile
    const profile = await db.profile.findFirst();
    const primarySkills = profile?.primarySkills?.split(',').map(s => s.trim().toLowerCase()) || [];

    const savedJobs = [];
    for (const job of extractedJobs) {
      try {
        const jobText = `${job.title} ${job.description} ${(job.skills || []).join(' ')}`.toLowerCase();
        const matchCount = primarySkills.filter(sk => sk && jobText.includes(sk)).length;
        const score = Math.min(100, Math.round((matchCount / Math.max(primarySkills.length, 1)) * 100));
        const alignment = score >= 70 ? 'Strong Match' : score >= 45 ? 'Good Match' : score >= 20 ? 'Stretch' : 'Ignore';

        const saved = await db.job.create({
          data: {
            title: job.title || 'Unknown',
            companyName: job.companyName || 'Unknown',
            location: job.location || location || 'India',
            url: job.url || '',
            description: job.description || '',
            source: job.source || 'web_search',
            skills: JSON.stringify(job.skills || []),
            experienceRange: job.experienceRange || '',
            workMode: job.workMode || 'Onsite',
            isRemote: job.workMode?.toLowerCase() === 'remote' || false,
            datePosted: new Date().toISOString(),
            status: 'new',
          },
        });

        if (score > 0) {
          await db.jobMatch.create({
            data: {
              jobId: saved.id,
              score,
              alignment,
              matchingSkills: JSON.stringify(primarySkills.filter(sk => sk && jobText.includes(sk))),
              missingSkills: JSON.stringify((job.skills || []).filter((s: string) => !primarySkills.includes(s.toLowerCase()))),
            },
          });
        }

        savedJobs.push({ ...saved, skills: job.skills || [], matchScore: score, alignment });
      } catch {
        // skip failed
      }
    }

    await db.activityLog.create({
      data: { type: 'search', action: 'Job Search', detail: `Searched "${query}" - found ${savedJobs.length} jobs` },
    });

    return NextResponse.json({ success: true, query, location, totalResults: savedJobs.length, results: savedJobs });
  } catch (error) {
    console.error('Job search error:', error);
    return NextResponse.json({ error: 'Failed to search jobs', details: String(error) }, { status: 500 });
  }
}
