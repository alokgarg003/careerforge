import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [totalJobs, strongMatches, activeApplications, companiesTargeted, applications, topJobs] =
      await Promise.all([
        db.job.count(),
        db.jobMatch.count({
          where: { score: { gte: 70 } },
        }),
        db.application.count({
          where: {
            status: { notIn: ["rejected"] },
          },
        }),
        db.company.count(),
        db.application.findMany({
          select: { status: true },
        }),
        db.job.findMany({
          where: {
            match: { isNot: null },
          },
          include: {
            match: true,
          },
          orderBy: {
            dateScraped: "desc",
          },
          take: 10,
        }),
      ]);

    // Calculate pipeline counts
    const pipelineCounts = {
      interested: 0,
      applied: 0,
      interviewing: 0,
      offered: 0,
      rejected: 0,
    };

    for (const app of applications) {
      const status = app.status as keyof typeof pipelineCounts;
      if (status in pipelineCounts) {
        pipelineCounts[status]++;
      }
    }

    // Recent activity
    const recentActivity = await db.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      totalJobs,
      strongMatches,
      activeApplications,
      companiesTargeted,
      pipelineCounts,
      recentActivity,
      topJobs,
    });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
