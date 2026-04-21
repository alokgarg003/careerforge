import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateMatchScore, deduplicateJobs } from '@/lib/match-engine';
import ZAI from 'z-ai-web-dev-sdk';

// POST /api/jobs/search - Enhanced multi-strategy job search
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query,
      location = '',
      numResults = 10,
      strategy = 'ai_web',      // ai_web | career_page | free_api | company_bulk | smart
      companyId,                 // for company-specific search
      companyIds,                // for bulk company search
    } = body;

    if (!query && strategy !== 'company_bulk' && strategy !== 'free_api') {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const zai = await ZAI.create();
    const profile = await db.profile.findFirst();
    const primarySkills = profile?.primarySkills?.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) || [];
    const secondarySkills = profile?.secondarySkills?.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) || [];
    const excludeSignals = profile?.excludeSignals?.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) || [];

    let allJobs: any[] = [];

    switch (strategy) {
      case 'free_api':
        allJobs = await searchFreeAPIs(zai);
        break;
      case 'career_page':
        if (companyId) {
          allJobs = await crawlCareerPage(zai, companyId);
        } else {
          allJobs = await searchAIWeb(zai, query, location, numResults);
        }
        break;
      case 'company_bulk':
        allJobs = await bulkCompanySearch(zai, companyIds || [], primarySkills, secondarySkills, excludeSignals);
        break;
      case 'smart':
        // Smart strategy: try free APIs first, then AI web search
        allJobs = await searchFreeAPIs(zai);
        if (allJobs.length < 5 && query) {
          const webJobs = await searchAIWeb(zai, query, location, numResults);
          allJobs = [...allJobs, ...webJobs];
        }
        break;
      case 'ai_web':
      default:
        allJobs = await searchAIWeb(zai, query, location, numResults);
        break;
    }

    // Deduplicate
    allJobs = deduplicateJobs(allJobs);

    // Score and save each job
    const savedJobs = [];
    for (const job of allJobs) {
      try {
        const jobText = `${job.title} ${job.description} ${(job.skills || []).join(' ')}`.toLowerCase();
        const jobSkills = Array.isArray(job.skills) ? job.skills : [];

        const result = calculateMatchScore(jobText, primarySkills, secondarySkills, excludeSignals, jobSkills);

        // Skip if excluded (score 0 with exclusion penalty)
        if (result.score === 0 && result.penaltyReasons.length > 0 && result.penaltyReasons[0].startsWith('Excluded')) {
          continue;
        }

        // Auto-link to company if found
        let companyIdToLink = job.companyId;
        if (!companyIdToLink && job.companyName) {
          const existingCompany = await db.company.findFirst({
            where: { name: { equals: job.companyName, mode: 'insensitive' } },
          });
          if (existingCompany) companyIdToLink = existingCompany.id;
        }

        const saved = await db.job.create({
          data: {
            title: job.title || 'Unknown',
            companyName: job.companyName || 'Unknown',
            location: job.location || location || 'India',
            url: job.url || '',
            description: job.description || '',
            source: job.source || strategy,
            skills: JSON.stringify(job.skills || []),
            experienceRange: job.experienceRange || '',
            workMode: job.workMode || 'Onsite',
            isRemote: job.workMode?.toLowerCase() === 'remote' || false,
            datePosted: job.datePosted || new Date().toISOString(),
            status: 'new',
            companyId: companyIdToLink,
          },
        });

        // Create match record
        if (result.score > 0) {
          await db.jobMatch.create({
            data: {
              jobId: saved.id,
              score: result.score,
              alignment: result.alignment,
              matchingSkills: JSON.stringify(result.matchingSkills),
              missingSkills: JSON.stringify(result.missingSkills),
              matchReasons: JSON.stringify(result.matchReasons),
              whyFits: result.matchReasons.join('. '),
            },
          });
        }

        savedJobs.push({
          ...saved,
          skills: job.skills || [],
          matchScore: result.score,
          alignment: result.alignment,
          matchReasons: result.matchReasons,
        });
      } catch {
        // skip failed jobs
      }
    }

    // Sort by score descending
    savedJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    // Log activity
    await db.activityLog.create({
      data: {
        type: 'search',
        action: 'Job Search',
        detail: `[${strategy}] "${query || 'bulk'}" - found ${savedJobs.length} jobs`,
      },
    });

    return NextResponse.json({
      success: true,
      query,
      strategy,
      totalFound: allJobs.length,
      totalSaved: savedJobs.length,
      results: savedJobs,
    });
  } catch (error) {
    console.error('Job search error:', error);
    return NextResponse.json({ error: 'Failed to search jobs', details: String(error) }, { status: 500 });
  }
}

// ── Strategy 1: AI Web Search ──
async function searchAIWeb(zai: any, query: string, location: string, numResults: number) {
  const searchQuery = location
    ? `${query} jobs ${location} site:linkedin.com OR site:naukri.com OR site:indeed.com`
    : `${query} jobs India site:linkedin.com OR site:naukri.com OR site:indeed.com`;

  const searchResults = await zai.functions.invoke('web_search', {
    query: searchQuery,
    num: numResults,
  });

  if (!Array.isArray(searchResults) || searchResults.length === 0) return [];

  // Read top pages for details
  const detailedJobs: any[] = [];
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
        source: 'web_search',
        snippet: r.snippet,
        description: text.substring(0, 3000),
        datePosted: pageData?.data?.publishedTime || r.date || new Date().toISOString(),
      });
    } catch {
      detailedJobs.push({
        title: r.name,
        url: r.url,
        source: 'web_search',
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
      source: 'web_search',
      snippet: r.snippet,
      description: r.snippet,
      datePosted: r.date || new Date().toISOString(),
    });
  }

  // LLM extract structured data
  const prompt = `Extract structured job data. Return JSON array. Each item: title, companyName, location, description, skills (array of strings), experienceRange, workMode (Remote/Hybrid/Onsite).

Listings: ${JSON.stringify(detailedJobs.slice(0, 5), null, 2)}

Return ONLY valid JSON array. No markdown.`;

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'assistant', content: 'You extract structured data. Return only valid JSON.' },
      { role: 'user', content: prompt },
    ],
    thinking: { type: 'disabled' },
  });

  let extractedJobs: any[];
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

  // Merge URLs from original results
  return extractedJobs.map((job: any, i: number) => ({
    ...job,
    url: job.url || detailedJobs[i]?.url || '',
    source: 'web_search',
    datePosted: job.datePosted || detailedJobs[i]?.datePosted || new Date().toISOString(),
  }));
}

// ── Strategy 2: Free Job APIs ──
async function searchFreeAPIs(zai: any) {
  const allJobs: any[] = [];
  const apis = [
    {
      name: 'Remotive',
      url: 'https://remotive.com/api/remote-jobs?search=support&limit=10',
      parser: (data: any) => (data.jobs || []).map((j: any) => ({
        title: j.title,
        companyName: j.company_name,
        location: j.candidate_required_location || 'Remote',
        url: j.url,
        description: j.description?.substring(0, 2000) || '',
        skills: j.tags || [],
        workMode: 'Remote',
        source: 'free_api_remotive',
        datePosted: j.publication_date || new Date().toISOString(),
      })),
    },
    {
      name: 'Jobicy',
      url: 'https://jobicy.com/api?tag=devops&count=10',
      parser: (data: any) => (data.jobs || []).map((j: any) => ({
        title: j.title || j.jobTitle,
        companyName: j.company || j.companyName,
        location: j.geo || 'Remote',
        url: j.url || j.link,
        description: j.description?.substring(0, 2000) || '',
        skills: j.skills ? j.skills.split(',').map((s: string) => s.trim()) : [],
        workMode: j.remote ? 'Remote' : 'Onsite',
        source: 'free_api_jobicy',
        datePosted: j.pubDate || new Date().toISOString(),
      })),
    },
    {
      name: 'Arbeitnow',
      url: 'https://www.arbeitnow.com/api/job-board-api?search=support&page=1',
      parser: (data: any) => (data.data || []).map((j: any) => ({
        title: j.title,
        companyName: j.company_name,
        location: j.location || 'Remote',
        url: j.url,
        description: j.description?.substring(0, 2000) || '',
        skills: j.tags || [],
        workMode: j.remote ? 'Remote' : 'Onsite',
        source: 'free_api_arbeitnow',
        datePosted: j.created_at || new Date().toISOString(),
      })),
    },
  ];

  for (const api of apis) {
    try {
      const resp = await fetch(api.url, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(15000),
      });
      if (resp.ok) {
        const data = await resp.json();
        const jobs = api.parser(data);
        allJobs.push(...jobs);
      }
    } catch (err) {
      console.log(`Free API ${api.name} failed:`, err);
    }
  }

  return allJobs;
}

// ── Strategy 3: Career Page Crawler ──
async function crawlCareerPage(zai: any, companyId: string) {
  const company = await db.company.findUnique({ where: { id: companyId } });
  if (!company?.careerPageUrl) {
    return [];
  }

  const allJobs: any[] = [];

  // Try crawling the career page directly
  try {
    const pageData = await zai.functions.invoke('page_reader', { url: company.careerPageUrl });
    const html = pageData?.data?.html || '';
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    // Use LLM to extract job listings from the page content
    const prompt = `Extract ALL job listings from this career page. Return a JSON array. Each item: title, companyName: "${company.name}", location, description (first 500 chars), skills (array), experienceRange, workMode.

Company: ${company.name}
Career Page Content: ${text.substring(0, 5000)}

Return ONLY valid JSON array. No markdown.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'You extract job listings from web pages. Return only valid JSON arrays.' },
        { role: 'user', content: prompt },
      ],
      thinking: { type: 'disabled' },
    });

    const responseText = completion.choices[0]?.message?.content || '[]';
    const match = responseText.match(/\[[\s\S]*\]/);
    const extractedJobs = JSON.parse(match ? match[0] : '[]');

    allJobs.push(...extractedJobs.map((j: any) => ({
      ...j,
      companyName: j.companyName || company.name,
      url: j.url || company.careerPageUrl,
      source: 'career_page',
      companyId: company.id,
      datePosted: new Date().toISOString(),
    })));
  } catch (err) {
    console.log(`Career page crawl failed for ${company.name}:`, err);
  }

  // Also try searching for jobs at this specific company
  try {
    const searchQuery = `${company.name} careers jobs ${company.searchKeywords || company.industry}`;
    const searchResults = await zai.functions.invoke('web_search', {
      query: searchQuery,
      num: 5,
    });

    if (Array.isArray(searchResults)) {
      for (const r of searchResults.slice(0, 3)) {
        try {
          const pageData = await zai.functions.invoke('page_reader', { url: r.url });
          const html = pageData?.data?.html || '';
          const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

          const prompt = `Extract job listings. Return JSON array with: title, companyName: "${company.name}", location, description, skills (array), workMode.

Content: ${text.substring(0, 3000)}

Return ONLY valid JSON array.`;
          const completion = await zai.chat.completions.create({
            messages: [
              { role: 'assistant', content: 'Extract job data. Return JSON only.' },
              { role: 'user', content: prompt },
            ],
            thinking: { type: 'disabled' },
          });

          const responseText = completion.choices[0]?.message?.content || '[]';
          const m = responseText.match(/\[[\s\S]*\]/);
          const jobs = JSON.parse(m ? m[0] : '[]');
          allJobs.push(...jobs.map((j: any) => ({
            ...j,
            companyName: j.companyName || company.name,
            url: j.url || r.url,
            source: 'career_page',
            companyId: company.id,
            datePosted: new Date().toISOString(),
          })));
        } catch {
          // skip
        }
      }
    }
  } catch {
    // skip
  }

  // Update company scan data
  await db.company.update({
    where: { id: companyId },
    data: {
      lastScannedAt: new Date(),
      scanResultsCount: allJobs.length,
    },
  });

  return allJobs;
}

// ── Strategy 4: Bulk Company Search ──
async function bulkCompanySearch(
  zai: any,
  companyIds: string[],
  _primarySkills: string[],
  _secondarySkills: string[],
  _excludeSignals: string[],
) {
  const allJobs: any[] = [];

  // If no company IDs provided, use top-priority targeted companies
  let companies;
  if (companyIds.length > 0) {
    companies = await db.company.findMany({ where: { id: { in: companyIds } } });
  } else {
    companies = await db.company.findMany({
      where: { status: 'targeted' },
      orderBy: [{ priority: 'desc' }, { tier: 'asc' }],
      take: 10, // Limit to 10 companies per bulk search
    });
  }

  for (const company of companies) {
    try {
      // Build company-specific search query
      const keywords = company.searchKeywords || company.industry || '';
      const locations = company.searchLocation || company.ncrOffice || 'India';

      const query = keywords
        ? `${keywords} jobs ${company.name}`
        : `${company.name} careers jobs application support`;

      const searchResults = await zai.functions.invoke('web_search', {
        query: `${query} ${locations}`,
        num: 5,
      });

      if (!Array.isArray(searchResults) || searchResults.length === 0) continue;

      // Read top 2 results
      for (const r of searchResults.slice(0, 2)) {
        try {
          const pageData = await zai.functions.invoke('page_reader', { url: r.url });
          const html = pageData?.data?.html || '';
          const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

          const prompt = `Extract job listings from ${company.name}. Return JSON array: title, companyName: "${company.name}", location, description (max 500 chars), skills (array), workMode.

Content: ${text.substring(0, 3000)}

Return ONLY valid JSON array.`;
          const completion = await zai.chat.completions.create({
            messages: [
              { role: 'assistant', content: 'Extract job data. JSON only.' },
              { role: 'user', content: prompt },
            ],
            thinking: { type: 'disabled' },
          });

          const responseText = completion.choices[0]?.message?.content || '[]';
          const m = responseText.match(/\[[\s\S]*\]/);
          const jobs = JSON.parse(m ? m[0] : '[]');
          allJobs.push(...jobs.map((j: any) => ({
            ...j,
            companyName: j.companyName || company.name,
            url: j.url || r.url,
            source: 'career_page',
            companyId: company.id,
            datePosted: new Date().toISOString(),
          })));
        } catch {
          // skip
        }
      }

      // Update company scan data
      await db.company.update({
        where: { id: company.id },
        data: {
          lastScannedAt: new Date(),
        },
      });
    } catch (err) {
      console.log(`Bulk search failed for ${company.name}:`, err);
    }
  }

  return allJobs;
}
