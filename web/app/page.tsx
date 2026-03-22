"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Zap, 
  Target, 
  Code2, 
  AlertCircle, 
  Trophy,
  Bell,
  Settings,
  Search,
  GitBranch,
  Star,
  ExternalLink,
  ArrowRight,
  Flame,
  TrendingUp,
  Users,
  Plus,
  ChevronRight,
  GitPullRequest,
  Clock,
  CheckCircle2,
  MessageSquare
} from "lucide-react";

// Reusable Card Component
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-5 py-4 border-b border-white/5 ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}

// Stat Card Component
function StatCard({ 
  label, 
  value, 
  change, 
  changeType, 
  icon: Icon,
  color 
}: { 
  label: string; 
  value: string; 
  change: string; 
  changeType: "positive" | "negative";
  icon: any;
  color: "violet" | "cyan" | "emerald" | "orange";
}) {
  const colorClasses = {
    violet: "bg-violet-500/10 text-violet-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    orange: "bg-orange-500/10 text-orange-400",
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-5 hover:border-white/10 transition-colors cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          <Badge className={`text-xs ${
            changeType === "positive" 
              ? "bg-emerald-500/10 text-emerald-400 border-0" 
              : "bg-red-500/10 text-red-400 border-0"
          }`}>
            {change}
          </Badge>
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm text-zinc-400">{label}</div>
      </Card>
    </motion.div>
  );
}

// Match Card Component
function MatchCard({ 
  name, 
  stars, 
  match, 
  issues, 
  language,
  description,
  trending 
}: { 
  name: string; 
  stars: string; 
  match: number; 
  issues: number; 
  language: string;
  description?: string;
  trending?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/dashboard/matches?repo=${encodeURIComponent(name)}`}>
        <Card className="p-5 hover:border-white/10 transition-all cursor-pointer h-full">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            {trending && (
              <Badge className="bg-orange-500/10 text-orange-400 border-0 text-xs">
                <Flame className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {language}
            </Badge>
          </div>
          
          {/* Title */}
          <h3 className="font-semibold mb-1 flex items-center gap-2 group">
            {name}
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          
          {/* Description */}
          {description && (
            <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{description}</p>
          )}
          
          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-500" />
              {stars}
            </span>
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {issues} issues
            </span>
          </div>
          
          {/* Match Score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                {match}%
              </div>
              <span className="text-xs text-zinc-400">match</span>
            </div>
            <Button size="sm" className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity">
              View
            </Button>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

// Activity Item Component
function ActivityItem({ 
  type, 
  title, 
  project, 
  time 
}: { 
  type: "match" | "pr" | "issue" | "star" | "merged";
  title: string; 
  project?: string; 
  time: string;
}) {
  const config = {
    match: { icon: Target, color: "violet" },
    pr: { icon: GitPullRequest, color: "emerald" },
    issue: { icon: AlertCircle, color: "cyan" },
    star: { icon: Star, color: "yellow" },
    merged: { icon: CheckCircle2, color: "violet" },
  };

  const { icon: Icon, color } = config[type];
  const bgColor = `bg-${color}-500/10`;
  const textColor = `text-${color}-400`;

  return (
    <div className="flex items-start gap-3 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer group">
      <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${textColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="group-hover:text-violet-400 transition-colors">{title}</span>
          {project && <span className="text-zinc-400 ml-1">in {project}</span>}
        </p>
        <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
          <Clock className="w-3 h-3" />
          {time}
        </p>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex h-14 items-center gap-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 mr-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 via-cyan-500 to-emerald-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm hidden sm:block">OSS Marketplace</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-0.5 flex-1">
              {[
                { href: "/", label: "Dashboard", icon: Target },
                { href: "/explore", label: "Explore", icon: Search },
                { href: "/dashboard/matches", label: "Matches", icon: Target },
                { href: "/dashboard/projects", label: "Projects", icon: GitBranch },
              ].map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    i === 0 
                      ? "bg-white/10 text-white" 
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative w-9 h-9">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
              </Button>
              <Button variant="ghost" size="icon" className="w-9 h-9">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-xs">
                A
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Welcome */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold mb-1">Welcome back, Alex</h1>
          <p className="text-zinc-400">Track your open source journey</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Active Matches" value="24" change="+3" changeType="positive" icon={Target} color="violet" />
          <StatCard label="Contributions" value="156" change="+12" changeType="positive" icon={Code2} color="cyan" />
          <StatCard label="Open Issues" value="47" change="-5" changeType="negative" icon={AlertCircle} color="emerald" />
          <StatCard label="Success Rate" value="87%" change="+5%" changeType="positive" icon={Trophy} color="orange" />
        </div>

        {/* Main Grid */}
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
                    <Target className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Top Matches for You</h2>
                    <p className="text-sm text-zinc-400">Based on your skills</p>
                  </div>
                </div>
                <Link href="/dashboard/matches">
                  <Button variant="ghost" size="sm" className="text-violet-400">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MatchCard name="vercel/next.js" stars="115k" match={94} issues={234} language="TypeScript" description="The React Framework for the Web" trending />
                <MatchCard name="tailwindlabs/tailwindcss" stars="78k" match={89} issues={89} language="CSS" description="A utility-first CSS framework" />
                <MatchCard name="shadcn/ui" stars="32k" match={87} issues={156} language="TypeScript" description="Beautiful components built with Radix UI" />
                <MatchCard name="tanstack/query" stars="22k" match={82} issues={67} language="TypeScript" description="Powerful asynchronous state management" />
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
                    <Flame className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Trending Now</h2>
                    <p className="text-sm text-zinc-400">Hot this week</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "v0", stars: "8.2k", match: 91 },
                  { name: "cursor", stars: "12k", match: 88 },
                  { name: "bolt.new", stars: "6.5k", match: 85 },
                ].map((project) => (
                  <Card key={project.name} className="p-4 hover:border-white/10 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">TypeScript</Badge>
                      <span className="text-sm font-medium bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                        {project.match}%
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-violet-400 transition-colors">{project.name}</h3>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {project.stars}
                    </span>
                  </Card>
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
              <Card>
                <CardHeader>
                  <h3 className="text-sm font-semibold">Quick Actions</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/explore">
                    <Button variant="outline" className="w-full justify-start gap-3 h-11 group">
                      <Search className="w-5 h-5 text-violet-400" />
                      Find Projects
                      <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/profile">
                    <Button variant="outline" className="w-full justify-start gap-3 h-11 group">
                      <Users className="w-5 h-5 text-cyan-400" />
                      Update Profile
                      <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/projects">
                    <Button variant="outline" className="w-full justify-start gap-3 h-11 group">
                      <Plus className="w-5 h-5 text-emerald-400" />
                      Add Project
                      <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <h3 className="text-sm font-semibold">Recent Activity</h3>
                  <Badge className="bg-violet-500/10 text-violet-400 border-0 text-xs">4 new</Badge>
                </CardHeader>
                <div className="divide-y divide-white/5">
                  <div className="px-5">
                    <ActivityItem type="match" title="New 94% match found" project="vercel/next.js" time="2 hours ago" />
                    <ActivityItem type="pr" title="Your PR was merged" project="shadcn/ui" time="5 hours ago" />
                    <ActivityItem type="issue" title="New good-first-issue" project="tanstack/query" time="1 day ago" />
                    <ActivityItem type="star" title="You starred" project="microsoft/vscode" time="2 days ago" />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Top Contributors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-sm font-semibold">Top Contributors</h3>
                </CardHeader>
                <div className="divide-y divide-white/5">
                  {[
                    { name: "Sarah Chen", contributions: 234, avatar: "S" },
                    { name: "Alex Kim", contributions: 189, avatar: "A" },
                    { name: "Jordan Lee", contributions: 156, avatar: "J" },
                  ].map((user) => (
                    <div key={user.name} className="px-5 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-xs">
                          {user.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium group-hover:text-violet-400 transition-colors">{user.name}</p>
                          <p className="text-xs text-zinc-400">{user.contributions} contributions</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
