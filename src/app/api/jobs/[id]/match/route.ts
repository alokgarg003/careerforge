import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';

// POST /api/jobs/[id]/match - AI-powered job matching analysis
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get job
    const job = await db.job.findUnique({ where: { id } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get profile
    const profile = await db.profile.findFirst();
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found. Please set up your profile first.' }, { status: 400 });
    }

    const primarySkills = profile.primarySkills?.split(',').map(s => s.trim()) || [];
    const secondarySkills = profile.secondarySkills?.split(',').map(s => s.trim()) || [];
    const excludeSignals = profile.excludeSignals?.split(',').map(s => s.trim().toLowerCase()) || [];
    const targetRoles = profile.targetRoles?.split(',').map(s => s.trim()) || [];

    // Use LLM for deep analysis
    const zai = await ZAI.create();

    const analysisPrompt = `You are an expert career advisor performing job-match analysis.

CANDIDATE PROFILE:
- Current Role: ${profile.currentRole} at ${profile.currentCompany}
- Experience: ${profile.experienceYears} years
- Primary Skills: ${primarySkills.join(', ')}
- Secondary Skills: ${secondarySkills.join(', ')}
- Exclude Signals (warning signs): ${excludeSignals.join(', ')}
- Target Roles: ${targetRoles.join(', ')}
- Education: ${profile.education}
- Certifications: ${profile.certifications}
- Achievements: ${profile.achievements}

JOB LISTING:
- Title: ${job.title}
- Company: ${job.companyName}
- Location: ${job.location}
- Work Mode: ${job.workMode}
- Description: ${job.description}
- Skills Required: ${job.skills}

Analyze this job match thoroughly and return a JSON object with:
{
  "score": <number 0-100>,
  "alignment": "<Strong Match|Good Match|Stretch|Ignore>",
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "matchReasons": "Detailed explanation of why this job matches or doesn't",
  "whyFits": "2-3 sentence pitch for why the candidate is a good fit",
  "risks": "Any red flags or concerns about this role",
  "salaryAssessment": "Brief salary assessment based on role and market"
}

SCORING GUIDE:
- 12 points per primary skill match (max ~60)
- +10 bonus if MFT/file transfer related
- +8 bonus if ServiceNow/ITSM related
- +5 bonus if target role matches
- -30 penalty if heavy frontend/dev signals (react, vue, angular, DSA)
- -15 penalty if requires significantly more experience
- -10 for each missing critical skill

Return ONLY valid JSON. No markdown.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'You are a precise career analyst. Return only valid JSON objects.' },
        { role: 'user', content: analysisPrompt },
      ],
      thinking: { type: 'disabled' },
    });

    let analysis;
    try {
      const responseText = completion.choices[0]?.message?.content || '{}';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch {
      // Fallback to keyword scoring
      const jobText = `${job.title} ${job.description} ${job.skills}`.toLowerCase();
      const matchCount = primarySkills.filter(sk => sk && jobText.includes(sk.toLowerCase())).length;
      const score = Math.min(100, Math.round((matchCount / Math.max(primarySkills.length, 1)) * 100));
      const hasExclude = excludeSignals.some(ex => ex && jobText.includes(ex));

      analysis = {
        score: hasExclude ? Math.max(0, score - 30) : score,
        alignment: score >= 70 ? 'Strong Match' : score >= 45 ? 'Good Match' : score >= 20 ? 'Stretch' : 'Ignore',
        matchingSkills: primarySkills.filter(sk => sk && jobText.includes(sk.toLowerCase())),
        missingSkills: [],
        matchReasons: `Keyword-based match. ${matchCount} of ${primarySkills.length} primary skills found.`,
        whyFits: 'Based on skill matching analysis.',
        risks: hasExclude ? 'Job requires skills outside your target area.' : 'None identified.',
        salaryAssessment: 'Not available.',
      };
    }

    // Upsert match result
    await db.jobMatch.upsert({
      where: { jobId: id },
      create: {
        jobId: id,
        profileId: profile.id,
        score: analysis.score,
        alignment: analysis.alignment,
        matchingSkills: JSON.stringify(analysis.matchingSkills || []),
        missingSkills: JSON.stringify(analysis.missingSkills || []),
        matchReasons: analysis.matchReasons || '',
        whyFits: analysis.whyFits || '',
      },
      update: {
        score: analysis.score,
        alignment: analysis.alignment,
        matchingSkills: JSON.stringify(analysis.matchingSkills || []),
        missingSkills: JSON.stringify(analysis.missingSkills || []),
        matchReasons: analysis.matchReasons || '',
        whyFits: analysis.whyFits || '',
      },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        type: 'score',
        action: 'Match Analysis',
        detail: `Analyzed "${job.title}" at ${job.companyName} - Score: ${analysis.score} (${analysis.alignment})`,
        jobId: id,
      },
    });

    return NextResponse.json({
      success: true,
      jobId: id,
      ...analysis,
    });
  } catch (error) {
    console.error('Match analysis error:', error);
    return NextResponse.json({ error: 'Match analysis failed', details: String(error) }, { status: 500 });
  }
}
