import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';

// POST /api/resume/tailor - AI resume tailoring, cover letter & interview prep
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, type = 'all' } = body; // type: 'tailor', 'coverLetter', 'interview', 'all'

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    // Get job
    const job = await db.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get profile
    const profile = await db.profile.findFirst();
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 400 });
    }

    const zai = await ZAI.create();
    const result: Record<string, string> = {};

    // 1. Tailored Resume
    if (type === 'all' || type === 'tailor') {
      const tailorPrompt = `You are an expert resume writer who tailors resumes for specific job applications.

CANDIDATE PROFILE:
- Name: ${profile.name}
- Current Role: ${profile.currentRole} at ${profile.currentCompany}
- Experience: ${profile.experienceYears} years
- Primary Skills: ${profile.primarySkills}
- Secondary Skills: ${profile.secondarySkills}
- Education: ${profile.education}
- Certifications: ${profile.certifications}
- Achievements: ${profile.achievements}
- Current Resume Summary: ${profile.summary}

TARGET JOB:
- Title: ${job.title}
- Company: ${job.companyName}
- Location: ${job.location}
- Description: ${job.description}
- Skills Required: ${job.skills}

Create a TAILORED RESUME for this specific job. Include:
1. Professional Summary (tailored for this role)
2. Key Skills (reordered and highlighted to match job requirements)
3. Experience (emphasize relevant achievements)
4. Education
5. Certifications

Format as clean text with clear sections. Make it ATS-friendly.`;

      const tailorCompletion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: 'You are an expert resume writer. Create tailored, ATS-friendly resumes.' },
          { role: 'user', content: tailorPrompt },
        ],
        thinking: { type: 'disabled' },
      });

      result.tailoredResume = tailorCompletion.choices[0]?.message?.content || '';
    }

    // 2. Cover Letter
    if (type === 'all' || type === 'coverLetter') {
      const coverPrompt = `You are an expert cover letter writer.

CANDIDATE:
- Name: ${profile.name}
- Current Role: ${profile.currentRole} at ${profile.currentCompany}
- Experience: ${profile.experienceYears} years
- Key Skills: ${profile.primarySkills}, ${profile.secondarySkills}
- Top Achievement: ${profile.achievements}

TARGET JOB:
- Title: ${job.title}
- Company: ${job.companyName}
- Description: ${job.description}

Write a compelling, concise cover letter (3-4 paragraphs). Address it to the hiring manager. Be specific about why the candidate is a good fit. Keep it professional but warm. Do NOT use generic phrases - reference specific skills and experiences.`;

      const coverCompletion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: 'You write compelling, specific cover letters.' },
          { role: 'user', content: coverPrompt },
        ],
        thinking: { type: 'disabled' },
      });

      result.coverLetter = coverCompletion.choices[0]?.message?.content || '';
    }

    // 3. Interview Preparation
    if (type === 'all' || type === 'interview') {
      const interviewPrompt = `You are an interview coach preparing a candidate for a specific job interview.

CANDIDATE:
- Name: ${profile.name}
- Current Role: ${profile.currentRole}
- Experience: ${profile.experienceYears} years
- Skills: ${profile.primarySkills}, ${profile.secondarySkills}
- Company: ${profile.currentCompany}

TARGET INTERVIEW:
- Job Title: ${job.title}
- Company: ${job.companyName}
- Job Description: ${job.description}
- Required Skills: ${job.skills}

Generate 10 interview questions this candidate will likely face, with suggested answers.
Format as JSON array: [{"question": "...", "answer": "...", "category": "technical|behavioral|situational"}]

Include a mix of:
- Technical questions related to the job
- Behavioral questions (STAR method)
- Situational questions
- Questions about the company/role

Return ONLY valid JSON array. No markdown.`;

      const interviewCompletion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: 'You are an interview coach. Return only valid JSON.' },
          { role: 'user', content: interviewPrompt },
        ],
        thinking: { type: 'disabled' },
      });

      try {
        const text = interviewCompletion.choices[0]?.message?.content || '[]';
        const match = text.match(/\[[\s\S]*\]/);
        result.interviewQa = JSON.parse(match ? match[0] : text);
      } catch {
        result.interviewQa = interviewCompletion.choices[0]?.message?.content || 'Failed to generate interview prep.';
      }
    }

    // Update match record with generated content
    const existingMatch = await db.jobMatch.findUnique({ where: { jobId } });
    if (existingMatch) {
      await db.jobMatch.update({
        where: { jobId },
        data: {
          tailoredResume: result.tailoredResume || existingMatch.tailoredResume,
          coverLetter: result.coverLetter || existingMatch.coverLetter,
          interviewQa: result.interviewQa ? JSON.stringify(result.interviewQa) : existingMatch.interviewQa,
        },
      });
    } else {
      await db.jobMatch.create({
        data: {
          jobId,
          profileId: profile.id,
          tailoredResume: result.tailoredResume || '',
          coverLetter: result.coverLetter || '',
          interviewQa: result.interviewQa ? JSON.stringify(result.interviewQa) : '',
        },
      });
    }

    // Log activity
    await db.activityLog.create({
      data: {
        type: 'save',
        action: 'Resume AI Generated',
        detail: `Generated ${type} for "${job.title}" at ${job.companyName}`,
        jobId,
      },
    });

    return NextResponse.json({
      success: true,
      jobId,
      jobTitle: job.title,
      companyName: job.companyName,
      ...result,
    });
  } catch (error) {
    console.error('Resume tailor error:', error);
    return NextResponse.json({ error: 'Failed to generate resume content', details: String(error) }, { status: 500 });
  }
}
