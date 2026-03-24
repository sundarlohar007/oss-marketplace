"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Star,
  GitFork,
  Code,
  ExternalLink,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface MatchedRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  matchScore: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const suggestedRepos = [
  { name: "facebook/react", description: "The library for web and native user interfaces", language: "JavaScript", stars: 223000, matchScore: 94 },
  { name: "vercel/next.js", description: "The React Framework for the Web", language: "TypeScript", stars: 115000, matchScore: 91 },
  { name: "tensorflow/tensorflow", description: "An Open Source Machine Learning Framework", language: "C++", stars: 178000, matchScore: 88 },
  { name: "golang/go", description: "The Go programming language", language: "Go", stars: 104000, matchScore: 85 },
  { name: "rust-lang/rust", description: "Empowering everyone to build reliable and efficient software", language: "Rust", stars: 89000, matchScore: 82 },
  { name: "microsoft/vscode", description: "Code editing. Redefined.", language: "TypeScript", stars: 156000, matchScore: 79 },
];

export default function MatchesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      try {
        const mockMatches: MatchedRepo[] = suggestedRepos.map((repo) => ({
          id: Math.random(),
          name: repo.name.split("/")[1],
          full_name: repo.name,
          description: repo.description,
          html_url: `https://github.com/${repo.name}`,
          stargazers_count: repo.stars,
          forks_count: Math.floor(repo.stars * 0.1),
          language: repo.language,
          topics: [],
          matchScore: repo.matchScore,
          owner: {
            login: repo.name.split("/")[0],
            avatar_url: `https://avatars.githubusercontent.com/${repo.name.split("/")[0]}`,
          },
        }));
        setMatches(mockMatches);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchMatches();
    }
  }, [session]);

  const refreshMatches = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setMatches((prev) => [...prev].sort(() => Math.random() - 0.5));
    setRefreshing(false);
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 80) return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
    if (score >= 70) return "text-violet-400 bg-violet-500/10 border-violet-500/20";
    return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
  };

  const languageColors: Record<string, string> = {
    JavaScript: "bg-yellow-400",
    TypeScript: "bg-blue-400",
    Python: "bg-green-400",
    Go: "bg-cyan-400",
    Rust: "bg-orange-400",
    "C++": "bg-purple-400",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Your Matches</h1>
          <p className="text-zinc-400">Projects that match your skills and interests</p>
        </div>
        
        <button
          onClick={refreshMatches}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-emerald-500/10 border border-violet-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <div className="font-medium text-zinc-100">AI-Powered Matching</div>
            <div className="text-sm text-zinc-400">
              Matches are based on your GitHub activity, languages, and interests
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-violet-500/50 transition-colors group"
          >
            <div className="flex items-start gap-4">
              <img
                src={repo.owner.avatar_url}
                alt={repo.owner.login}
                className="w-12 h-12 rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-200">{repo.owner.login}</span>
                  <span className="text-zinc-500">/</span>
                  <span className="font-semibold text-violet-400 group-hover:text-violet-300">
                    {repo.name}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                  {repo.description}
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getMatchColor(
                  repo.matchScore
                )}`}
              >
                {repo.matchScore}% Match
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              {repo.language && (
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      languageColors[repo.language] || "bg-zinc-500"
                    }`}
                  />
                  <span className="text-sm text-zinc-400">{repo.language}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-sm text-zinc-400">
                <Star className="w-4 h-4" />
                {repo.stargazers_count.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-sm text-zinc-400">
                <GitFork className="w-4 h-4" />
                {repo.forks_count.toLocaleString()}
              </div>
              <button className="ml-auto flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300">
                <Heart className="w-4 h-4" />
                Save
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </a>
        ))}
      </div>

      {matches.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <div className="text-zinc-400">No matches yet</div>
          <p className="text-sm text-zinc-500 mt-1">
            Update your preferences to get better matches
          </p>
        </div>
      )}
    </div>
  );
}
