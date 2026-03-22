"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Zap, 
  Search, 
  GitBranch, 
  Bell,
  Settings,
  Target,
  Code2,
  AlertCircle,
  Trophy,
  TrendingUp,
  Flame,
  Users,
  Plus,
  ChevronRight,
  GitPullRequest,
  Star,
  ExternalLink,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Filter,
  BarChart3,
  Layers,
  Calendar
} from "lucide-react";

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex h-14 items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm text-zinc-100">OSS Marketplace</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {[
                { href: "/", label: "Dashboard", active: true },
                { href: "/explore", label: "Explore", active: false },
                { href: "/dashboard/matches", label: "Matches", active: false },
                { href: "/dashboard/projects", label: "Projects", active: false },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    item.active 
                      ? "bg-zinc-800 text-zinc-100" 
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-1 ml-auto">
              <Button variant="ghost" size="icon" className="w-9 h-9 text-zinc-400 hover:text-zinc-100">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-9 h-9 text-zinc-400 hover:text-zinc-100 relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-violet-500 rounded-full" />
              </Button>
              <Button variant="ghost" size="icon" className="w-9 h-9 text-zinc-400 hover:text-zinc-100">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="w-px h-5 bg-zinc-800 mx-2" />
              <div className="flex items-center gap-2 pl-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-white font-semibold text-xs">
                  A
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-100">Dashboard</h1>
              <p className="text-sm text-zinc-500 mt-1">Track your open source contributions</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Link href="/explore">
                <Button size="sm" className="bg-white text-zinc-900 hover:bg-zinc-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Find Projects
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          {[
            { 
              label: "Active Matches", 
              value: "24", 
              change: "+3 this week", 
              icon: Target, 
              color: "violet" 
            },
            { 
              label: "Contributions", 
              value: "156", 
              change: "+12 this month", 
              icon: Code2, 
              color: "cyan" 
            },
            { 
              label: "Open Issues", 
              value: "47", 
              change: "-5 this week", 
              icon: AlertCircle, 
              color: "emerald" 
            },
            { 
              label: "Success Rate", 
              value: "87%", 
              change: "+5% improvement", 
              icon: Trophy, 
              color: "orange" 
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeIn}
              className="group"
            >
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5 hover:bg-zinc-900/80 hover:border-zinc-700/50 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    stat.color === 'violet' ? 'bg-violet-500/10 text-violet-400' : 
                    stat.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' :
                    stat.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                    'bg-orange-500/10 text-orange-400'
                  }`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-3xl font-semibold text-zinc-100 mb-1">{stat.value}</div>
                <div className="text-sm text-zinc-500 mb-2">{stat.label}</div>
                <div className={`text-xs ${
                  stat.change.startsWith('+') ? 'text-emerald-400' : 
                  stat.change.startsWith('-') ? 'text-red-400' : 'text-zinc-400'
                }`}>{stat.change}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Matches */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-zinc-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Target className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-zinc-100">Top Matches</h2>
                      <p className="text-xs text-zinc-500">Based on your skills and interests</p>
                    </div>
                  </div>
                  <Link href="/dashboard/matches">
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100 text-xs h-8">
                      View all <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>

                {/* Content */}
                <div className="divide-y divide-zinc-800/50">
                  {[
                    { 
                      name: "vercel/next.js", 
                      stars: "115k", 
                      match: 94, 
                      issues: 234, 
                      language: "TypeScript",
                      description: "The React Framework for the Web",
                      trending: true 
                    },
                    { 
                      name: "tailwindlabs/tailwindcss", 
                      stars: "78k", 
                      match: 89, 
                      issues: 89, 
                      language: "CSS",
                      description: "A utility-first CSS framework",
                      trending: false 
                    },
                    { 
                      name: "shadcn/ui", 
                      stars: "32k", 
                      match: 87, 
                      issues: 156, 
                      language: "TypeScript",
                      description: "Beautifully designed components built with Radix UI",
                      trending: true 
                    },
                  ].map((match, i) => (
                    <motion.div
                      key={match.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="px-5 py-4 hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mt-0.5">
                            <GitBranch className="w-5 h-5 text-zinc-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-zinc-100 group-hover:text-violet-400 transition-colors">
                                {match.name}
                              </h3>
                              {match.trending && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-500/10 text-orange-400">
                                  <Flame className="w-2.5 h-2.5" /> trending
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-500 mb-2">{match.description}</p>
                            <div className="flex items-center gap-4 text-xs text-zinc-500">
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                {match.stars}
                              </span>
                              <span className="flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {match.issues} issues
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                {match.language}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-semibold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                              {match.match}%
                            </div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-wide">match</div>
                          </div>
                          <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity h-8">
                            View
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Trending Projects */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <Flame className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-zinc-100">Trending Now</h2>
                      <p className="text-xs text-zinc-500">Hot projects this week</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: "v0", stars: "8.2k", match: 91, lang: "TypeScript" },
                      { name: "cursor", stars: "12k", match: 88, lang: "TypeScript" },
                      { name: "bolt.new", stars: "6.5k", match: 85, lang: "TypeScript" },
                    ].map((project) => (
                      <div key={project.name} className="bg-zinc-800/50 rounded-lg p-4 hover:bg-zinc-800 transition-colors cursor-pointer group">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="bg-zinc-700/50 text-zinc-300 text-[10px]">
                            {project.lang}
                          </Badge>
                          <span className="text-xs font-medium bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                            {project.match}%
                          </span>
                        </div>
                        <h3 className="font-medium text-zinc-100 mb-1 group-hover:text-violet-400 transition-colors">
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
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-800/50">
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
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-800/50">
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
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-800/50 flex items-center justify-between">
                  <h2 className="text-sm font-medium text-zinc-100">Recent Activity</h2>
                  <Badge className="bg-violet-500/10 text-violet-400 border-0 text-[10px]">
                    4 new
                  </Badge>
                </div>
                <div className="divide-y divide-zinc-800/50">
                  {[
                    { type: "match", title: "New 94% match found", project: "vercel/next.js", time: "2h ago" },
                    { type: "pr", title: "Your PR was merged", project: "shadcn/ui", time: "5h ago" },
                    { type: "issue", title: "New good-first-issue", project: "tanstack/query", time: "1d ago" },
                    { type: "star", title: "You starred", project: "microsoft/vscode", time: "2d ago" },
                  ].map((item, i) => (
                    <div key={i} className="px-5 py-3 hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.type === 'match' ? 'bg-violet-500/10 text-violet-400' :
                          item.type === 'pr' ? 'bg-emerald-500/10 text-emerald-400' :
                          item.type === 'issue' ? 'bg-cyan-500/10 text-cyan-400' :
                          'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {item.type === 'match' && <Target className="w-3.5 h-3.5" />}
                          {item.type === 'pr' && <GitPullRequest className="w-3.5 h-3.5" />}
                          {item.type === 'issue' && <AlertCircle className="w-3.5 h-3.5" />}
                          {item.type === 'star' && <Star className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-zinc-300 group-hover:text-zinc-100">
                            {item.title} <span className="text-zinc-500">{item.project}</span>
                          </p>
                          <p className="text-xs text-zinc-600 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {item.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Top Contributors */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-800/50">
                  <h2 className="text-sm font-medium text-zinc-100">Top Contributors</h2>
                </div>
                <div className="divide-y divide-zinc-800/50">
                  {[
                    { name: "Sarah Chen", contributions: 234, avatar: "S", rank: 1 },
                    { name: "Alex Kim", contributions: 189, avatar: "A", rank: 2 },
                    { name: "Jordan Lee", contributions: 156, avatar: "J", rank: 3 },
                  ].map((user) => (
                    <div key={user.name} className="px-5 py-3 hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-600 w-4">#{user.rank}</span>
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-white font-semibold text-xs">
                          {user.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-zinc-300 group-hover:text-zinc-100">{user.name}</p>
                        </div>
                        <span className="text-xs text-zinc-500">{user.contributions}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer spacing */}
        <div className="h-16" />
      </main>
    </div>
  );
}
