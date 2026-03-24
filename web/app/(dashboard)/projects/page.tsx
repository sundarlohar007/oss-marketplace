"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  GitFork,
  Eye,
  Code,
  Calendar,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  open_issues_count: number;
  license: { name: string } | null;
}

const languageColors: Record<string, string> = {
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-400",
  Python: "bg-green-400",
  Go: "bg-cyan-400",
  Rust: "bg-orange-400",
  Java: "bg-red-400",
  "C++": "bg-purple-400",
};

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"updated" | "stars" | "name">("updated");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchRepos() {
      if (!session?.user?.username) return;

      try {
        const res = await fetch(`/api/github/repos/${session.user.username}`);
        const data = await res.json();
        setRepos(data);
      } catch (error) {
        console.error("Failed to fetch repos:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchRepos();
    }
  }, [session]);

  const sortedRepos = [...repos].sort((a, b) => {
    if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
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
          <h1 className="text-2xl font-bold text-zinc-100">Your Projects</h1>
          <p className="text-zinc-400">
            {repos.length} repositories
          </p>
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-200 focus:outline-none focus:border-violet-500"
        >
          <option value="updated">Recently Updated</option>
          <option value="stars">Most Stars</option>
          <option value="name">Name</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedRepos.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-violet-500/50 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-zinc-500" />
                <span className="font-semibold text-violet-400 group-hover:text-violet-300">
                  {repo.name}
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
            </div>

            <p className="text-sm text-zinc-500 mt-2 line-clamp-2">
              {repo.description || "No description"}
            </p>

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
                {repo.stargazers_count}
              </div>
              <div className="flex items-center gap-1 text-sm text-zinc-400">
                <GitFork className="w-4 h-4" />
                {repo.forks_count}
              </div>
            </div>

            <div className="flex items-center gap-1 mt-3 text-xs text-zinc-600">
              <Calendar className="w-3 h-3" />
              Updated {formatDate(repo.updated_at)}
            </div>

            {repo.topics && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {repo.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-500"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>

      {repos.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          No repositories found
        </div>
      )}
    </div>
  );
}
