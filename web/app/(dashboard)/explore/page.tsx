"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Star,
  GitFork,
  Code,
  ExternalLink,
  Filter,
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
  language: string | null;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}

const languages = ["", "JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "C++"];
const sortOptions = [
  { value: "", label: "Any stars" },
  { value: ">1000", label: "1000+" },
  { value: ">5000", label: "5000+" },
  { value: ">10000", label: "10000+" },
];

export default function ExplorePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [stars, setStars] = useState("");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const searchRepos = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({ q: query });
      if (language) params.append("language", language);
      if (stars) params.append("stars", stars);

      const res = await fetch(`/api/github/search?${params}`);
      const data = await res.json();
      setRepos(data.repos || []);
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchRepos();
    }
  };

  const languageColors: Record<string, string> = {
    JavaScript: "bg-yellow-400",
    TypeScript: "bg-blue-400",
    Python: "bg-green-400",
    Go: "bg-cyan-400",
    Rust: "bg-orange-400",
    Java: "bg-red-400",
    "C++": "bg-purple-400",
    HTML: "bg-orange-500",
    CSS: "bg-pink-400",
    Ruby: "bg-red-500",
    Swift: "bg-orange-300",
    Kotlin: "bg-purple-300",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Explore Projects</h1>
        <p className="text-zinc-400">Discover open source projects that match your interests</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search projects (e.g., machine learning, web framework)..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:border-violet-500"
            >
              <option value="">All Languages</option>
              {languages.filter(l => l).map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            
            <select
              value={stars}
              onChange={(e) => setStars(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:border-violet-500"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <button
              onClick={searchRepos}
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 px-6 bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
              Search
            </button>
          </div>
        </div>
      </div>

      {hasSearched && (
        <div className="text-sm text-zinc-500">
          Found {totalCount.toLocaleString()} results
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      ) : repos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-violet-500/50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <img
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  className="w-10 h-10 rounded-lg"
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
                    {repo.description || "No description"}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
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
              </div>

              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {repo.topics.slice(0, 5).map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      ) : hasSearched ? (
        <div className="text-center py-12 text-zinc-500">
          No projects found. Try a different search term.
        </div>
      ) : (
        <div className="text-center py-12 text-zinc-500">
          Enter a search term to discover projects
        </div>
      )}
    </div>
  );
}
