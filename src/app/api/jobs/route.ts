import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const alignment = searchParams.get("alignment");
    const search = searchParams.get("search");

    const where: Prisma.JobWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (alignment === "strong") {
      where.match = {
        score: { gte: 70 },
      };
    } else if (alignment === "medium") {
      where.match = {
        score: { gte: 40, lt: 70 },
      };
    } else if (alignment === "weak") {
      where.match = {
        score: { lt: 40 },
        NOT: undefined,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { companyName: { contains: search } },
        { location: { contains: search } },
        { skills: { contains: search } },
      ];
    }

    const jobs = await db.job.findMany({
      where,
      orderBy: { dateScraped: "desc" },
      include: {
        match: true,
        applications: true,
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      companyName,
      location,
      url,
      description,
      source,
      skills,
      workMode,
      jobType,
      experienceRange,
      salaryMin,
      salaryMax,
      isRemote,
      companyIndustry,
      externalId,
      notes,
      companyId,
      status,
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Try to link to existing company
    let linkedCompanyId = companyId;
    if (!linkedCompanyId && companyName) {
      const existingCompany = await db.company.findFirst({
        where: { name: { contains: companyName } },
      });
      if (existingCompany) {
        linkedCompanyId = existingCompany.id;
      }
    }

    const job = await db.job.create({
      data: {
        title,
        companyName: companyName || "",
        location: location || "",
        url: url || "",
        description: description || "",
        source: source || "manual",
        skills: skills || "",
        workMode: workMode || "Onsite",
        jobType: jobType || "Full-time",
        experienceRange: experienceRange || "",
        salaryMin: salaryMin ?? undefined,
        salaryMax: salaryMax ?? undefined,
        isRemote: isRemote ?? false,
        companyIndustry: companyIndustry || "",
        externalId: externalId || "",
        notes: notes || "",
        companyId: linkedCompanyId || null,
        status: status || "new",
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("POST /api/jobs error:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
