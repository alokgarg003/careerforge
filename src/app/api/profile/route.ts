import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    let profile = await db.profile.findFirst();

    if (!profile) {
      profile = await db.profile.create({
        data: {},
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Get or create profile
    let profile = await db.profile.findFirst();

    if (!profile) {
      profile = await db.profile.create({
        data: body,
      });
    } else {
      profile = await db.profile.update({
        where: { id: profile.id },
        data: body,
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
