import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';
import { calculateMatchScore } from '@/lib/match-engine';

// POST /api/jobs/[id]/match - AI + Rule-based job matching analysis
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get job with existing match
    const job = await db.job.findUnique({
      where: { id },
      include: { match: true },
    });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get profile
    const profile = await db.profile.findFirst();
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found. Please set up your profile first.' }, { status: 400 });
    }

    const primarySkills = profile.primarySkills?.split(',').map(s => s.trim().toLowerCase()) || [];
    const secondarySkills = profile.secondarySkills?.split(',').map(s => s.trim().toLowerCase()) || [];
    const excludeSignals = profile.excludeSignals?.split(',').map(s => s.trim().toLowerCase()) || [];
    const targetRoles = profile.targetRoles?.split(',').map(s => s.trim()) || [];

    let jobSkills: string[] = [];
    try {
      jobSkills = typeof job.skills === 'string' ? JSON.parse(job.skills) : (job.skills || []);
    } catch { jobSkills = []; }

    // ── Step 1: Fast rule-based scoring ──
    const jobText = `${job.title} ${job.description} ${jobSkills.join(' ')}`;
    const ruleResult = calculateMatchScore(jobText, primarySkills, secondarySkills, excludeSignals, jobSkills);

    // ── Step 2: AI deep analysis for additional insights ──
    let aiAnalysis: any = {};
    try {
      const zai = await ZAI.create();
      const analysisPrompt = `You are an expert career advisor. Provide a brief JSON analysis.

CANDIDATE: ${profile.currentRole} at ${profile.currentCompany}, ${profile.experienceYears}y exp
Skills: ${primarySkills.join(', ')}
Target Roles: ${targetRoles.join(', ')}

JOB: ${job.title} at ${job.companyName} | ${job.location} | ${job.workMode}
Description: ${(job.description || '').substring(0, 1500)}
Required Skills: ${jobSkills.join(', ')}

RULE-BASED SCORE: ${ruleResult.score}/100 (${ruleResult.alignment})
Match Reasons: ${ruleResult.matchReasons.join('; ')}
Penalties: ${ruleResult.penaltyReasons.join('; ') || 'None'}

Return JSON: { "whyFits": "2-3 sentence pitch", "risks": "red flags", "salaryAssessment": "brief assessment", "interviewTips": "2-3 tips" }
Return ONLY valid JSON. No markdown.`;

      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: 'You are a precise career analyst. Return only valid JSON.' },
          { role: 'user', content: analysisPrompt },
        ],
        thinking: { type: 'disabled' },
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      aiAnalysis = JSON.parse(jsonMatch ? jsonMatch[0] : '{}');
    } catch {
      aiAnalysis = {
        whyFits: `Based on ${ruleResult.matchingSkills.length} matching skills.`,
        risks: ruleResult.penaltyReasons.length > 0 ? ruleResult.penaltyReasons.join('. ') : 'None identified.',
        salaryAssessment: 'Not available.',
        interviewTips: 'Research the company and prepare examples of relevant experience.',
      };
    }

    // ── Step 3: Merge results ──
    const finalAnalysis = {
      score: ruleResult.score,
      alignment: ruleResult.alignment,
      matchingSkills: ruleResult.matchingSkills,
      missingSkills: ruleResult.missingSkills,
      matchReasons: ruleResult.matchReasons.join('. '),
      whyFits: aiAnalysis.whyFits || '',
      risks: aiAnalysis.risks || '',
      salaryAssessment: aiAnalysis.salaryAssessment || '',
      interviewTips: aiAnalysis.interviewTips || '',
      bonusPoints: ruleResult.bonusPoints,
      penaltyPoints: ruleResult.penaltyPoints,
    };

    // Upsert match result
    await db.jobMatch.upsert({
      where: { jobId: id },
      create: {
        jobId: id,
        profileId: profile.id,
        score: finalAnalysis.score,
        alignment: finalAnalysis.alignment,
        matchingSkills: JSON.stringify(finalAnalysis.matchingSkills),
        missingSkills: JSON.stringify(finalAnalysis.missingSkills),
        matchReasons: finalAnalysis.matchReasons,
        whyFits: finalAnalysis.whyFits,
      },
      update: {
        score: finalAnalysis.score,
        alignment: finalAnalysis.alignment,
        matchingSkills: JSON.stringify(finalAnalysis.matchingSkills),
        missingSkills: JSON.stringify(finalAnalysis.missingSkills),
        matchReasons: finalAnalysis.matchReasons,
        whyFits: finalAnalysis.whyFits,
      },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        type: 'score',
        action: 'Match Analysis',
        detail: `Analyzed "${job.title}" at ${job.companyName} - Score: ${finalAnalysis.score} (${finalAnalysis.alignment})`,
        jobId: id,
      },
    });

    return NextResponse.json({
      success: true,
      jobId: id,
      ...finalAnalysis,
    });
  } catch (error) {
    console.error('Match analysis error:', error);
    return NextResponse.json({ error: 'Match analysis failed', details: String(error) }, { status: 500 });
  }
}
