import { NextResponse } from "next/server";
import { fetchUserRepos } from "@/lib/github/client";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    const repos = await fetchUserRepos(username, { per_page: 30 });
    return NextResponse.json(repos);
  } catch (error) {
    console.error("Failed to fetch repos:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
