"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Users, 
  GitBranch, 
  TrendingUp, 
  Bell,
  Settings,
  Plus,
  ArrowRight,
  Star,
  Code2,
  Target,
  Zap,
  MessageSquare,
  Heart,
  ExternalLink,
  Activity
} from "lucide-react";

const mockMatches = [
  { name: "vercel/next.js", stars: "115k", match: 94, reason: "React, TypeScript expertise" },
  { name: "tailwindlabs/tailwindcss", stars: "78k", match: 89, reason: "CSS architecture skills" },
  { name: "shadcn/ui", stars: "32k", match: 87, reason: "Component design experience" },
  { name: "tanstack/query", stars: "22k", match: 82, reason: "State management match" },
];

const mockProjects = [
  { name: "my-project/oss-tool", role: "Maintainer", issues: 12, openPRs: 3 },
  { name: "contrib/rust-web", role: "Contributor", commits: 45 },
];

const recentActivity = [
  { type: "match", text: "New 94% match found for vercel/next.js", time: "2h ago" },
  { type: "pr", text: "Your PR was merged in shadcn/ui", time: "5h ago" },
  { type: "issue", text: "New good-first-issue in tanstack/query", time: "1d ago" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-3 mr-8">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 via-cyan-500 to-emerald-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">OSS Marketplace</span>
          </div>
          
          <nav className="flex items-center gap-1 flex-1">
            <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 text-violet-400 font-medium text-sm">
              <Activity className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/explore" className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium text-sm transition-colors">
              <Search className="w-4 h-4" />
              Explore
            </Link>
            <Link href="/dashboard/matches" className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium text-sm transition-colors">
              <Target className="w-4 h-4" />
              Matches
            </Link>
            <Link href="/dashboard/projects" className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium text-sm transition-colors">
              <GitBranch className="w-4 h-4" />
              Projects
            </Link>
          </nav>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
              U
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Welcome & Quick Stats */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Welcome back, User</h1>
          <p className="text-muted-foreground">Here's what's happening with your open source journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Matches", value: "24", icon: Target, color: "violet", change: "+3 this week" },
            { label: "Contributions", value: "156", icon: Code2, color: "cyan", change: "+12 this month" },
            { label: "Projects", value: "8", icon: GitBranch, color: "emerald", change: "+2 this month" },
            { label: "Success Rate", value: "87%", icon: TrendingUp, color: "violet", change: "+5% improvement" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                    </div>
                    <Badge variant="outline" className="text-xs">{stat.change}</Badge>
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Matches */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Top Matches for You</CardTitle>
              <Link href="/dashboard/matches">
                <Button variant="ghost" size="sm" className="text-violet-500">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMatches.map((match, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                        <GitBranch className="w-6 h-6 text-violet-500" />
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {match.name}
                          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-sm text-muted-foreground">{match.reason}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                        {match.match}%
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Star className="w-3 h-3 fill-current" />
                        {match.stars}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/explore" className="block">
                  <Button className="w-full justify-start gap-3 h-12">
                    <Search className="w-5 h-5" />
                    Find New Projects
                  </Button>
                </Link>
                <Link href="/dashboard/profile" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3 h-12">
                    <Users className="w-5 h-5" />
                    Update Profile
                  </Button>
                </Link>
                <Link href="/dashboard/projects" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3 h-12">
                    <Plus className="w-5 h-5" />
                    Add Project
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.type === "match" ? "bg-violet-500/10" :
                        item.type === "pr" ? "bg-emerald-500/10" : "bg-cyan-500/10"
                      }`}>
                        {item.type === "match" && <Target className="w-4 h-4 text-violet-500" />}
                        {item.type === "pr" && <GitBranch className="w-4 h-4 text-emerald-500" />}
                        {item.type === "issue" && <MessageSquare className="w-4 h-4 text-cyan-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{item.text}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Your Projects */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Your Projects</CardTitle>
                <Badge variant="secondary">{mockProjects.length}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockProjects.map((project, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                          <GitBranch className="w-4 h-4 text-violet-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{project.name}</div>
                          <div className="text-xs text-muted-foreground">{project.role}</div>
                        </div>
                      </div>
                      {project.issues && (
                        <div className="text-right">
                          <div className="text-sm font-semibold">{project.issues} issues</div>
                          <div className="text-xs text-muted-foreground">{project.openPRs} open PRs</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
