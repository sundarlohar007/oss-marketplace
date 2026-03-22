"use client";

import { Sidebar, Topbar } from "@/components/layout";
import { StatCard, ProjectCard, ActivityFeed } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Target, 
  Code2, 
  AlertCircle, 
  Trophy,
  Search,
  Users,
  Plus,
  GitPullRequest,
  Star,
  Flame
} from "lucide-react";

const stats = [
  { label: "Active Matches", value: "24", change: "+3", changeType: "positive" as const, icon: Target, color: "violet" as const },
  { label: "Contributions", value: "156", change: "+12", changeType: "positive" as const, icon: Code2, color: "cyan" as const },
  { label: "Open Issues", value: "47", change: "-5", changeType: "negative" as const, icon: AlertCircle, color: "emerald" as const },
  { label: "Success Rate", value: "87%", change: "+5%", changeType: "positive" as const, icon: Trophy, color: "orange" as const },
];

const projects = [
  { name: "vercel/next.js", stars: "115k", match: 94, issues: 234, language: "TypeScript", description: "The React Framework for the Web", trending: true },
  { name: "tailwindlabs/tailwindcss", stars: "78k", match: 89, issues: 89, language: "CSS", description: "A utility-first CSS framework", trending: false },
  { name: "shadcn/ui", stars: "32k", match: 87, issues: 156, language: "TypeScript", description: "Beautifully designed components", trending: true },
  { name: "tanstack/query", stars: "22k", match: 82, issues: 67, language: "TypeScript", description: "Powerful asynchronous state management", trending: false },
];

const trending = [
  { name: "v0", stars: "8.2k", match: 91, lang: "TypeScript" },
  { name: "cursor", stars: "12k", match: 88, lang: "TypeScript" },
  { name: "bolt.new", stars: "6.5k", match: 85, lang: "TypeScript" },
];

const activity = [
  { id: "1", type: "match" as const, title: "New 94% match found", project: "vercel/next.js", time: "2h ago" },
  { id: "2", type: "pr" as const, title: "Your PR was merged", project: "shadcn/ui", time: "5h ago" },
  { id: "3", type: "issue" as const, title: "New good-first-issue", project: "tanstack/query", time: "1d ago" },
  { id: "4", type: "star" as const, title: "You starred", project: "microsoft/vscode", time: "2d ago" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />
      
      <div className="pl-60">
        <Topbar title="Dashboard" subtitle="Track your open source journey" />
        
        <main className="max-w-7xl mx-auto px-6 py-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Top Matches */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Target className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-zinc-100">Top Matches</h2>
                      <p className="text-xs text-zinc-500">Based on your skills</p>
                    </div>
                  </div>
                  <Link href="/dashboard/matches">
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100 text-xs h-8">
                      View all
                    </Button>
                  </Link>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project) => (
                      <ProjectCard key={project.name} {...project} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Trending */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <Flame className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-zinc-100">Trending Now</h2>
                      <p className="text-xs text-zinc-500">Hot this week</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {trending.map((project) => (
                      <div key={project.name} className="bg-zinc-800/50 rounded-lg p-4 hover:bg-zinc-800 transition-colors cursor-pointer group">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-zinc-400 bg-zinc-700 px-2 py-0.5 rounded">{project.lang}</span>
                          <span className="text-sm font-medium bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                            {project.match}%
                          </span>
                        </div>
                        <h3 className="font-semibold text-zinc-100 mb-1 group-hover:text-violet-400 transition-colors">
                          {project.name}
                        </h3>
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {project.stars} stars
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-800">
                  <h2 className="text-sm font-medium text-zinc-100">Your Stats</h2>
                </div>
                <div className="p-5 grid grid-cols-3 gap-4">
                  {[
                    { label: "Open PRs", value: "8", icon: GitPullRequest, color: "emerald" },
                    { label: "Watched", value: "23", icon: Star, color: "violet" },
                    { label: "Following", value: "12", icon: Users, color: "cyan" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className={`w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center ${
                        stat.color === 'violet' ? 'bg-violet-500/10 text-violet-400' :
                        stat.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <div className="text-lg font-semibold text-zinc-100">{stat.value}</div>
                      <div className="text-xs text-zinc-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-800">
                  <h2 className="text-sm font-medium text-zinc-100">Quick Actions</h2>
                </div>
                <div className="p-3 space-y-1">
                  <Link href="/explore">
                    <Button variant="ghost" className="w-full justify-start h-11 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800">
                      <Search className="w-4 h-4 mr-3 text-violet-400" />
                      Find Projects
                    </Button>
                  </Link>
                  <Link href="/dashboard/profile">
                    <Button variant="ghost" className="w-full justify-start h-11 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800">
                      <Users className="w-4 h-4 mr-3 text-cyan-400" />
                      Update Profile
                    </Button>
                  </Link>
                  <Link href="/dashboard/projects">
                    <Button variant="ghost" className="w-full justify-start h-11 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800">
                      <Plus className="w-4 h-4 mr-3 text-emerald-400" />
                      Add Project
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Activity Feed */}
              <ActivityFeed items={activity} />
            </div>
          </div>

          {/* Footer spacing */}
          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}
