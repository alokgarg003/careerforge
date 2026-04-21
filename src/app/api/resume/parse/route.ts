import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';

// POST /api/resume/parse - AI-powered resume parsing and skill extraction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, fileName } = body;

    if (!text || text.trim().length < 50) {
      return NextResponse.json({ error: 'Resume text is required and must be at least 50 characters' }, { status: 400 });
    }

    const zai = await ZAI.create();

    const parsePrompt = `You are an expert resume parser and career advisor. Analyze this resume and extract structured information.

RESUME TEXT:
${text.substring(0, 8000)}

Return a JSON object with:
{
  "name": "Full name",
  "email": "Email address",
  "phone": "Phone number",
  "location": "Current location",
  "currentRole": "Current/most recent job title",
  "currentCompany": "Current/most recent company",
  "totalExperience": "X years",
  "education": ["degree1", "degree2"],
  "certifications": ["cert1", "cert2"],
  "technicalSkills": {
    "primary": ["skill1", "skill2"],
    "secondary": ["skill1", "skill2"],
    "tools": ["tool1", "tool2"]
  },
  "achievements": ["achievement1", "achievement2"],
  "summary": "A 2-3 sentence professional summary",
  "strengths": ["strength1", "strength2"],
  "improvements": ["area1", "area2"],
  "atsScore": <number 0-100>,
  "atsFeedback": "Feedback on ATS optimization"
}

Return ONLY valid JSON. No markdown.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'You are a resume analysis expert. Return only valid JSON.' },
        { role: 'user', content: parsePrompt },
      ],
      thinking: { type: 'disabled' },
    });

    let parsedData;
    try {
      const responseText = completion.choices[0]?.message?.content || '{}';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      parsedData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch {
      return NextResponse.json({ error: 'Failed to parse resume. Please try again with clearer text.' }, { status: 500 });
    }

    // Update profile with extracted data
    const profile = await db.profile.findFirst();
    if (profile) {
      await db.profile.update({
        where: { id: profile.id },
        data: {
          resumeText: text,
          name: parsedData.name || profile.name,
          email: parsedData.email || profile.email,
          phone: parsedData.phone || profile.phone,
          location: parsedData.location || profile.location,
          currentRole: parsedData.currentRole || profile.currentRole,
          currentCompany: parsedData.currentCompany || profile.currentCompany,
          education: parsedData.education?.join(', ') || profile.education,
          certifications: parsedData.certifications?.join(', ') || profile.certifications,
          achievements: parsedData.achievements?.join(', ') || profile.achievements,
          summary: parsedData.summary || profile.summary,
          primarySkills: parsedData.technicalSkills?.primary?.join(', ') || profile.primarySkills,
          secondarySkills: parsedData.technicalSkills?.secondary?.join(', ') || profile.secondarySkills,
        },
      });
    }

    // Log activity
    await db.activityLog.create({
      data: {
        type: 'save',
        action: 'Resume Parsed',
        detail: `Parsed resume${fileName ? ` (${fileName})` : ''}. ATS Score: ${parsedData.atsScore || 'N/A'}`,
      },
    });

    return NextResponse.json({
      success: true,
      ...parsedData,
      fileName,
    });
  } catch (error) {
    console.error('Resume parse error:', error);
    return NextResponse.json({ error: 'Failed to parse resume', details: String(error) }, { status: 500 });
  }
}
