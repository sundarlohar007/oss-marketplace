import { NextResponse } from "next/server";
import { searchRepositories } from "@/lib/github/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const language = searchParams.get("language") || undefined;
    const topic = searchParams.get("topic") || undefined;
    const stars = searchParams.get("stars") || undefined;
    const page = parseInt(searchParams.get("page") || "1");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const results = await searchRepositories(query, {
      language,
      topic,
      stars,
      page,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Failed to search repos:", error);
    return NextResponse.json(
      { error: "Failed to search repositories" },
      { status: 500 }
    );
  }
}
