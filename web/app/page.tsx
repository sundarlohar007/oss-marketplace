"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar, StatCard, MatchCard, ActivityFeed } from "@/components/dashboard";
import { 
  Target, 
  Code2, 
  AlertCircle, 
  Trophy,
  Search,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  Flame,
  ChevronRight
} from "lucide-react";

const stats = [
  { label: "Active Matches", value: "24", change: "+3", changeType: "positive" as const, icon: Target, color: "violet" as const },
  { label: "Contributions", value: "156", change: "+12", changeType: "positive" as const, icon: Code2, color: "cyan" as const },
  { label: "Open Issues", value: "47", change: "-5", changeType: "negative" as const, icon: AlertCircle, color: "emerald" as const },
  { label: "Success Rate", value: "87%", change: "+5%", changeType: "positive" as const, icon: Trophy, color: "orange" as const },
];

const matches = [
  { name: "vercel/next.js", stars: "115k", match: 94, issues: 234, language: "TypeScript", description: "The React Framework for the Web", trending: true, new: false },
  { name: "tailwindlabs/tailwindcss", stars: "78k", match: 89, issues: 89, language: "CSS", description: "A utility-first CSS framework", trending: true, new: false },
  { name: "shadcn/ui", stars: "32k", match: 87, issues: 156, language: "TypeScript", description: "Beautiful components built with Radix UI", trending: false, new: true },
  { name: "tanstack/query", stars: "22k", match: 82, issues: 67, language: "TypeScript", description: "Powerful asynchronous state management", trending: false, new: false },
  { name: "microsoft/vscode", stars: "156k", match: 78, issues: 892, language: "TypeScript", description: "Open Source VSCode Editor", trending: false, new: false },
  { name: "denoland/deno", stars: "94k", match: 75, issues: 234, language: "Rust", description: "A modern runtime for JavaScript and TypeScript", trending: false, new: false },
];

const activity = [
  { id: "1", type: "match" as const, title: "New 94% match found", project: "vercel/next.js", time: "2 hours ago" },
  { id: "2", type: "pr" as const, title: "Your PR was merged", project: "shadcn/ui", time: "5 hours ago" },
  { id: "3", type: "issue" as const, title: "New good-first-issue assigned", project: "tanstack/query", time: "1 day ago" },
  { id: "4", type: "star" as const, title: "You starred", project: "microsoft/vscode", time: "2 days ago" },
  { id: "5", type: "merged" as const, title: "PR merged in", project: "tailwindcss", time: "3 days ago" },
];

const quickActions = [
  { label: "Find Projects", icon: Search, href: "/explore", color: "violet" },
  { label: "Update Profile", icon: Users, href: "/dashboard/profile", color: "cyan" },
  { label: "Add Project", icon: Plus, href: "/dashboard/projects", color: "emerald" },
];

const quickStats = [
  { label: "Open PRs", value: "8", icon: TrendingUp, color: "emerald" },
  { label: "Watched", value: "23", icon: Target, color: "violet" },
  { label: "Following", value: "12", icon: Users, color: "cyan" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-1">Welcome back, Alex</h1>
          <p className="text-muted-foreground">Track your open source journey and discover new opportunities</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Matches */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Top Matches for You</h2>
                    <p className="text-sm text-muted-foreground">Based on your skills and interests</p>
                  </div>
                </div>
                <Link href="/dashboard/matches">
                  <Button variant="ghost" size="sm" className="text-violet-500 hover:text-violet-400">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.slice(0, 4).map((match) => (
                  <MatchCard key={match.name} {...match} />
                ))}
              </div>
            </motion.div>

            {/* Trending Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Trending Now</h2>
                    <p className="text-sm text-muted-foreground">Hot projects this week</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "v0", lang: "TypeScript", stars: "8.2k", match: 91 },
                  { name: "cursor", lang: "TypeScript", stars: "12k", match: 88 },
                  { name: "bolt.new", lang: "TypeScript", stars: "6.5k", match: 85 },
                ].map((project, i) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">{project.lang}</Badge>
                      <span className="text-xs font-medium bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                        {project.match}%
                      </span>
                    </div>
                    <h3 className="font-semibold group-hover:text-violet-400 transition-colors mb-1">{project.name}</h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Flame className="w-3 h-3 text-yellow-500" />
                      {project.stars} stars
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Your Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Your GitHub Stats</h2>
                    <p className="text-sm text-muted-foreground">Activity overview</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {quickStats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-all text-center cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center ${
                      stat.color === 'violet' ? 'bg-violet-500/10' :
                      stat.color === 'cyan' ? 'bg-cyan-500/10' : 'bg-emerald-500/10'
                    }`}>
                      <stat.icon className={`w-5 h-5 ${
                        stat.color === 'violet' ? 'text-violet-500' :
                        stat.color === 'cyan' ? 'text-cyan-500' : 'text-emerald-500'
                      }`} />
                    </div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-violet-500" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {quickActions.map((action) => (
                    <Link key={action.label} href={action.href}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-3 h-11 group"
                      >
                        <action.icon className={`w-5 h-5 ${
                          action.color === 'violet' ? 'text-violet-500' :
                          action.color === 'cyan' ? 'text-cyan-500' : 'text-emerald-500'
                        }`} />
                        {action.label}
                        <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ActivityFeed items={activity} />
            </motion.div>

            {/* Top Contributors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                  <h3 className="text-sm font-semibold">Top Contributors</h3>
                </div>
                <div className="divide-y divide-white/5">
                  {[
                    { name: "Sarah Chen", contributions: 234, avatar: "S" },
                    { name: "Alex Kim", contributions: 189, avatar: "A" },
                    { name: "Jordan Lee", contributions: 156, avatar: "J" },
                  ].map((user, i) => (
                    <div key={user.name} className="px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-xs">
                          {user.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium group-hover:text-violet-400 transition-colors">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.contributions} contributions</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">#{i + 1}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
