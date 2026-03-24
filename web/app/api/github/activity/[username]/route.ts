import { NextResponse } from "next/server";
import { fetchUserActivity } from "@/lib/github/client";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    const activity = await fetchUserActivity(username, 20);
    return NextResponse.json(activity);
  } catch (error) {
    console.error("Failed to fetch activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
