"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  GitFork,
  Eye,
  TrendingUp,
  Users,
  Calendar,
  ArrowUpRight,
  Sparkles,
  Code,
  Heart,
} from "lucide-react";

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

interface GitHubActivity {
  type: string;
  repo: { name: string };
  created_at: string;
  payload: any;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [activity, setActivity] = useState<GitHubActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchGitHubData() {
      if (!session?.user?.username) return;

      try {
        const userRes = await fetch(`/api/github/user/${session.user.username}`);
        const userData = await userRes.json();
        setUser(userData);

        const reposRes = await fetch(`/api/github/repos/${session.user.username}`);
        const reposData = await reposRes.json();
        setRepos(reposData.slice(0, 5));

        const activityRes = await fetch(`/api/github/activity/${session.user.username}`);
        const activityData = await activityRes.json();
        setActivity(activityData.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch GitHub data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchGitHubData();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-zinc-400">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
  const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">
            Welcome back, {user?.name || user?.login}!
          </h1>
          <p className="text-zinc-400">Here's what's happening with your GitHub</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Code className="w-5 h-5 text-violet-400" />
            </div>
            <span className="text-sm text-zinc-400">Repositories</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100">{user?.public_repos || 0}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-sm text-zinc-400">Total Stars</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100">{totalStars.toLocaleString()}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm text-zinc-400">Followers</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100">{user?.followers || 0}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <GitFork className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-sm text-zinc-400">Forks</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100">{totalForks.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-100">Top Repositories</h2>
            <a
              href="/dashboard/projects"
              className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-3">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-zinc-100 truncate">{repo.name}</div>
                    <div className="text-sm text-zinc-500 truncate">{repo.description}</div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="flex items-center gap-1 text-sm text-zinc-400">
                      <Star className="w-4 h-4" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-zinc-400">
                      <GitFork className="w-4 h-4" />
                      {repo.forks_count}
                    </span>
                  </div>
                </div>
                {repo.language && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    <span className="text-xs text-zinc-500">{repo.language}</span>
                  </div>
                )}
              </a>
            ))}
            {repos.length === 0 && (
              <div className="text-center py-8 text-zinc-500">
                No repositories found
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-100">Recent Activity</h2>
            <a
              href="/dashboard/analytics"
              className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-4">
            {activity.map((event, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  {event.type === "PushEvent" ? (
                    <Code className="w-4 h-4 text-violet-400" />
                  ) : event.type === "PullRequestEvent" ? (
                    <GitFork className="w-4 h-4 text-cyan-400" />
                  ) : event.type === "WatchEvent" ? (
                    <Star className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Heart className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-zinc-300 truncate">
                    <span className="text-zinc-400">{event.type.replace("Event", "")}</span>{" "}
                    on {event.repo.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {new Date(event.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {activity.length === 0 && (
              <div className="text-center py-8 text-zinc-500">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-emerald-500/10 border border-violet-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-violet-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-zinc-100 mb-1">
              Discover Your Perfect Matches
            </h3>
            <p className="text-zinc-400 mb-4">
              Find open source projects that match your skills and interests based on your GitHub activity.
            </p>
            <a
              href="/dashboard/explore"
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-medium transition-colors"
            >
              Explore Projects
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
