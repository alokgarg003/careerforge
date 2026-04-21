import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get("tier");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Prisma.CompanyWhereInput = {};

    if (tier) {
      where.tier = parseInt(tier, 10);
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { industry: { contains: search } },
        { sector: { contains: search } },
        { hqLocation: { contains: search } },
      ];
    }

    const companies = await db.company.findMany({
      where,
      orderBy: [{ priority: "asc" }, { name: "asc" }],
      include: {
        jobs: {
          select: { id: true, title: true, status: true },
        },
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error("GET /api/companies error:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      industry,
      sector,
      tier,
      hqLocation,
      ncrOffice,
      employeeCount,
      careerPageUrl,
      linkedinUrl,
      salaryRange,
      notes,
      priority,
      status,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    const company = await db.company.create({
      data: {
        name,
        industry: industry || "",
        sector: sector || "IT Consulting",
        tier: tier ?? 3,
        hqLocation: hqLocation || "",
        ncrOffice: ncrOffice || "",
        employeeCount: employeeCount || "",
        careerPageUrl: careerPageUrl || "",
        linkedinUrl: linkedinUrl || "",
        salaryRange: salaryRange || "",
        notes: notes || "",
        priority: priority ?? 3,
        status: status || "targeted",
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error("POST /api/companies error:", error);
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}
