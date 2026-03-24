"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Calendar,
  Code,
  GitCommit,
  GitPullRequest,
  Loader2,
  TrendingUp,
  Clock,
} from "lucide-react";

interface GitHubActivity {
  type: string;
  repo: { name: string };
  created_at: string;
  payload: any;
}

interface GitHubRepo {
  id: number;
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activity, setActivity] = useState<GitHubActivity[]>([]);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.username) return;

      try {
        const [activityRes, reposRes] = await Promise.all([
          fetch(`/api/github/activity/${session.user.username}`),
          fetch(`/api/github/repos/${session.user.username}`),
        ]);

        const activityData = await activityRes.json();
        const reposData = await reposRes.json();

        setActivity(activityData.slice(0, 50));
        setRepos(reposData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchData();
    }
  }, [session]);

  const getActivityStats = () => {
    const pushEvents = activity.filter((e) => e.type === "PushEvent").length;
    const prEvents = activity.filter((e) => e.type === "PullRequestEvent").length;
    const starEvents = activity.filter((e) => e.type === "WatchEvent").length;
    const forkEvents = activity.filter((e) => e.type === "ForkEvent").length;

    return { pushEvents, prEvents, starEvents, forkEvents };
  };

  const getLanguageStats = () => {
    const langs: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo.language) {
        langs[repo.language] = (langs[repo.language] || 0) + 1;
      }
    });
    return Object.entries(langs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const getActivityByDay = () => {
    const days: Record<string, number> = {};
    activity.forEach((event) => {
      const day = new Date(event.created_at).toLocaleDateString("en-US", {
        weekday: "short",
      });
      days[day] = (days[day] || 0) + 1;
    });
    return days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  const stats = getActivityStats();
  const langStats = getLanguageStats();
  const dayStats = getActivityByDay();
  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
  const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);

  const maxDayCount = Math.max(...Object.values(dayStats), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Analytics</h1>
        <p className="text-zinc-400">Your GitHub activity and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <GitCommit className="w-5 h-5 text-violet-400" />
            </div>
            <span className="text-sm text-zinc-400">Commits</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100">{stats.pushEvents}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <GitPullRequest className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-sm text-zinc-400">Pull Requests</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100">{stats.prEvents}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm text-zinc-400">Total Stars</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100">{totalStars.toLocaleString()}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-sm text-zinc-400">Total Forks</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100">{totalForks.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Activity This Week</h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
              const count = dayStats[day] || 0;
              const height = (count / maxDayCount) * 100 || 4;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-zinc-800 rounded-t relative" style={{ height: "100%" }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-violet-500 to-cyan-500 rounded-t transition-all"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Top Languages</h3>
          <div className="space-y-3">
            {langStats.map(([lang, count], index) => (
              <div key={lang} className="flex items-center gap-3">
                <span className="w-6 text-sm text-zinc-500">#{index + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-zinc-300">{lang}</span>
                    <span className="text-sm text-zinc-500">{count} repos</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                      style={{ width: `${(count / repos.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {langStats.length === 0 && (
              <div className="text-center py-8 text-zinc-500">
                No language data available
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">Recent Events</h3>
        <div className="space-y-3">
          {activity.slice(0, 10).map((event, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  event.type === "PushEvent"
                    ? "bg-violet-500/10"
                    : event.type === "PullRequestEvent"
                    ? "bg-cyan-500/10"
                    : event.type === "WatchEvent"
                    ? "bg-emerald-500/10"
                    : "bg-zinc-700"
                }`}
              >
                {event.type === "PushEvent" ? (
                  <Code className="w-4 h-4 text-violet-400" />
                ) : event.type === "PullRequestEvent" ? (
                  <GitPullRequest className="w-4 h-4 text-cyan-400" />
                ) : event.type === "WatchEvent" ? (
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Clock className="w-4 h-4 text-zinc-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-zinc-300 truncate">
                  <span className="text-zinc-400">{event.type.replace("Event", "")}</span> on{" "}
                  {event.repo.name}
                </div>
              </div>
              <div className="text-xs text-zinc-500">
                {new Date(event.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
          {activity.length === 0 && (
            <div className="text-center py-8 text-zinc-500">
              No activity data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
