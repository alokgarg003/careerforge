import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const applications = await db.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("GET /api/applications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { jobId, status, priority, platform, notes, hrContact, hrEmail, hrPhone } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Verify job exists
    const job = await db.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const application = await db.application.create({
      data: {
        jobId,
        status: status || "interested",
        priority: priority || "medium",
        platform: platform || "",
        notes: notes || "",
        hrContact: hrContact || "",
        hrEmail: hrEmail || "",
        hrPhone: hrPhone || "",
        appliedAt: status === "applied" ? new Date() : null,
      },
      include: {
        job: true,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
