"use client";

import { Sidebar, Topbar } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp,
  GitPullRequest,
  Star,
  AlertCircle,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const monthlyData = [
  { month: "Jan", contributions: 45, prs: 8, issues: 12 },
  { month: "Feb", contributions: 62, prs: 12, issues: 18 },
  { month: "Mar", contributions: 78, prs: 15, issues: 22 },
  { month: "Apr", contributions: 54, prs: 10, issues: 15 },
  { month: "May", contributions: 89, prs: 18, issues: 25 },
  { month: "Jun", contributions: 102, prs: 22, issues: 30 },
];

const topRepositories = [
  { name: "vercel/next.js", contributions: 45, prs: 12, role: "Contributor" },
  { name: "shadcn/ui", contributions: 32, prs: 8, role: "Contributor" },
  { name: "tanstack/query", contributions: 25, prs: 5, role: "Contributor" },
  { name: "tailwindcss", contributions: 18, prs: 4, role: "Contributor" },
  { name: "radix-ui/primitives", contributions: 12, prs: 3, role: "Contributor" },
];

const activityByDay = [
  { day: "Mon", hours: 3 },
  { day: "Tue", hours: 5 },
  { day: "Wed", hours: 2 },
  { day: "Thu", hours: 6 },
  { day: "Fri", hours: 4 },
  { day: "Sat", hours: 1 },
  { day: "Sun", hours: 2 },
];

export default function AnalyticsPage() {
  const maxContributions = Math.max(...monthlyData.map(d => d.contributions));
  const totalContributions = monthlyData.reduce((sum, d) => sum + d.contributions, 0);
  const totalPRs = monthlyData.reduce((sum, d) => sum + d.prs, 0);
  const avgPerWeek = Math.round(totalContributions / 24);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />
      
      <div className="pl-60">
        <Topbar title="Analytics" subtitle="Your open source activity insights" />
        
        <main className="max-w-7xl mx-auto px-6 py-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-500">Total Contributions</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-zinc-100 mb-1">{totalContributions}</div>
              <div className="text-sm text-emerald-400">+23% from last month</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-500">Pull Requests</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-zinc-100 mb-1">{totalPRs}</div>
              <div className="text-sm text-emerald-400">+18% from last month</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-500">Avg per Week</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-zinc-100 mb-1">{avgPerWeek}</div>
              <div className="text-sm text-emerald-400">+5 from last month</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-500">Success Rate</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-zinc-100 mb-1">87%</div>
              <div className="text-sm text-emerald-400">+3% from last month</div>
            </div>
          </div>

          {/* Contribution Graph */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">Contribution Activity</h2>
                <p className="text-sm text-zinc-500">Your contributions over the last 6 months</p>
              </div>
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">
                Last 6 months
              </Badge>
            </div>
            <div className="flex items-end justify-between gap-2 h-48">
              {monthlyData.map((data, i) => (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center">
                    <div className="text-xs text-zinc-500 mb-1">{data.contributions}</div>
                    <div 
                      className="w-full bg-gradient-to-t from-violet-500 to-cyan-500 rounded-t-md transition-all hover:from-violet-400 hover:to-cyan-400"
                      style={{ height: `${(data.contributions / maxContributions) * 160}px` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-zinc-800">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <div className="w-3 h-3 rounded bg-violet-500" />
                Contributions
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <div className="w-3 h-3 rounded bg-cyan-500" />
                PRs Merged
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Repositories */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">Top Repositories</h2>
              <div className="space-y-3">
                {topRepositories.map((repo, i) => (
                  <div key={repo.name} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-zinc-600 w-4">#{i + 1}</span>
                      <div>
                        <div className="font-medium text-zinc-100">{repo.name}</div>
                        <div className="text-xs text-zinc-500">{repo.contributions} contributions</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                      {repo.prs} PRs
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity by Day */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">Activity by Day</h2>
              <p className="text-sm text-zinc-500 mb-6">Average contributions per day of week</p>
              <div className="flex items-end justify-between gap-2 h-40">
                {activityByDay.map((data) => {
                  const maxHours = Math.max(...activityByDay.map(d => d.hours));
                  return (
                    <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col items-center">
                        <div className="text-xs text-zinc-500 mb-1">{data.hours}h</div>
                        <div 
                          className="w-full bg-violet-500/20 rounded-t-sm"
                          style={{ height: `${(data.hours / maxHours) * 120}px` }}
                        >
                          <div 
                            className="w-full bg-violet-500 rounded-t-sm h-3"
                            style={{ height: `${(data.hours / maxHours) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-zinc-500">{data.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Match Analytics */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">Match Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-violet-400" />
                  </div>
                  <span className="text-sm text-zinc-500">Match Rate</span>
                </div>
                <div className="text-3xl font-bold text-zinc-100 mb-1">94%</div>
                <div className="text-sm text-zinc-500">Average match score</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <GitPullRequest className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-sm text-zinc-500">Response Rate</span>
                </div>
                <div className="text-3xl font-bold text-zinc-100 mb-1">78%</div>
                <div className="text-sm text-zinc-500">Maintainers responded</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-sm text-zinc-500">Contribution Success</span>
                </div>
                <div className="text-3xl font-bold text-zinc-100 mb-1">87%</div>
                <div className="text-sm text-zinc-500">PRs merged successfully</div>
              </div>
            </div>
          </div>

          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}
