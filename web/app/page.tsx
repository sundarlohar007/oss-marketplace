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
  ExternalLink,
  Activity,
  ChevronRight,
  GitPullRequest,
  AlertCircle,
  Flame,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  Eye
} from "lucide-react";

const stats = [
  { label: "Active Matches", value: "24", change: "+3", icon: Target, color: "violet" },
  { label: "Total Contributions", value: "156", change: "+12", icon: Code2, color: "cyan" },
  { label: "Open Issues", value: "47", change: "-5", icon: AlertCircle, color: "emerald" },
  { label: "Success Rate", value: "87%", change: "+5%", icon: Trophy, color: "violet" },
];

const topMatches = [
  { name: "vercel/next.js", stars: "115k", match: 94, issues: 234, lang: "TypeScript", trending: true },
  { name: "tailwindlabs/tailwindcss", stars: "78k", match: 89, issues: 89, lang: "CSS", trending: false },
  { name: "shadcn/ui", stars: "32k", match: 87, issues: 156, lang: "TypeScript", trending: true },
  { name: "tanstack/query", stars: "22k", match: 82, issues: 67, lang: "TypeScript", trending: false },
];

const recentActivity = [
  { type: "match", text: "New 94% match: vercel/next.js", time: "2h ago", icon: Target, color: "violet" },
  { type: "pr", text: "PR merged in shadcn/ui", time: "5h ago", icon: GitPullRequest, color: "emerald" },
  { type: "issue", text: "good-first-issue in tanstack", time: "1d ago", icon: AlertCircle, color: "cyan" },
  { type: "star", text: "You starred microsoft/vscode", time: "2d ago", icon: Star, color: "yellow" },
];

const quickStats = [
  { label: "Open PRs", value: 8, icon: GitPullRequest, color: "emerald" },
  { label: "Watched", value: 23, icon: Eye, color: "cyan" },
  { label: "Following", value: 12, icon: Users, color: "violet" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-3 mr-8">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 via-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">OSS Marketplace</span>
          </div>
          
          <nav className="flex items-center gap-1 flex-1">
            {[
              { href: "/", label: "Dashboard", icon: Activity, active: true },
              { href: "/explore", label: "Explore", icon: Search, active: false },
              { href: "/dashboard/matches", label: "Matches", icon: Target, active: false },
              { href: "/dashboard/projects", label: "Projects", icon: GitBranch, active: false },
            ].map((item) => (
              <Link key={item.href} href={item.href} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                item.active 
                  ? "bg-violet-500/10 text-violet-400 shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
              U
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-1">Welcome back, Alex</h1>
          <p className="text-muted-foreground">Track your open source contributions and discover new opportunities</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                      stat.color === 'violet' ? 'bg-violet-500/10' : 
                      stat.color === 'cyan' ? 'bg-cyan-500/10' : 'bg-emerald-500/10'
                    }`}>
                      <stat.icon className={`w-5 h-5 ${
                        stat.color === 'violet' ? 'text-violet-500' : 
                        stat.color === 'cyan' ? 'text-cyan-500' : 'text-emerald-500'
                      }`} />
                    </div>
                    <Badge variant={stat.change.startsWith('+') ? "default" : "secondary"} className={`text-xs ${
                      stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-600' : ''
                    }`}>
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Matches - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="border-b bg-muted/30 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <Target className="w-4 h-4 text-violet-500" />
                      </div>
                      <CardTitle className="text-lg">Top Matches for You</CardTitle>
                    </div>
                    <Link href="/dashboard/matches">
                      <Button variant="ghost" size="sm" className="text-violet-500 hover:text-violet-600">
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {topMatches.map((match, i) => (
                      <motion.div
                        key={match.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center shadow-sm">
                              <GitBranch className="w-6 h-6 text-violet-500" />
                            </div>
                            {match.trending && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                                <Flame className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              {match.name}
                              <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Star className="w-3 h-3" /> {match.stars}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600">{match.lang}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {match.issues} issues
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                              {match.match}%
                            </div>
                            <div className="text-xs text-muted-foreground">match score</div>
                          </div>
                          <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            View
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="border-b bg-muted/30 py-4">
                  <CardTitle className="text-lg">Your GitHub Stats</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    {quickStats.map((stat) => (
                      <div key={stat.label} className="text-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className={`w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center ${
                          stat.color === 'violet' ? 'bg-violet-500/10' : 
                          stat.color === 'cyan' ? 'bg-cyan-500/10' : 'bg-emerald-500/10'
                        }`}>
                          <stat.icon className={`w-5 h-5 ${
                            stat.color === 'violet' ? 'text-violet-500' : 
                            stat.color === 'cyan' ? 'text-cyan-500' : 'text-emerald-500'
                          }`} />
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className="border-b bg-muted/30 py-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-4 h-4 text-violet-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <Link href="/explore" className="block">
                    <Button className="w-full justify-start gap-3 h-12 group">
                      <Search className="w-5 h-5" />
                      Find Projects
                      <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/profile" className="block">
                    <Button variant="outline" className="w-full justify-start gap-3 h-12 group">
                      <Users className="w-5 h-5" />
                      Update Profile
                      <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/projects" className="block">
                    <Button variant="outline" className="w-full justify-start gap-3 h-12 group">
                      <Plus className="w-5 h-5" />
                      Add Project
                      <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="border-b bg-muted/30 py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-500" />
                      Recent Activity
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">4 new</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {recentActivity.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.color === 'violet' ? 'bg-violet-500/10' :
                          item.color === 'emerald' ? 'bg-emerald-500/10' :
                          item.color === 'cyan' ? 'bg-cyan-500/10' : 'bg-yellow-500/10'
                        }`}>
                          <item.icon className={`w-4 h-4 ${
                            item.color === 'violet' ? 'text-violet-500' :
                            item.color === 'emerald' ? 'text-emerald-500' :
                            item.color === 'cyan' ? 'text-cyan-500' : 'text-yellow-500'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.text}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" /> {item.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trending Projects */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader className="border-b bg-muted/30 py-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    Trending Now
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {[
                    { name: "v0", lang: "TypeScript", stars: "8.2k" },
                    { name: "cursor", lang: "TypeScript", stars: "12k" },
                    { name: "bolt.new", lang: "TypeScript", stars: "6.5k" },
                  ].map((project, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                          <GitBranch className="w-4 h-4 text-violet-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{project.name}</div>
                          <div className="text-xs text-muted-foreground">{project.lang}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" /> {project.stars}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
