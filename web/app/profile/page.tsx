"use client";

import { Sidebar, Topbar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Github,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Star,
  GitPullRequest,
  AlertCircle,
  Code,
  CheckCircle2
} from "lucide-react";

const skills = [
  { name: "TypeScript", level: 95 },
  { name: "React", level: 92 },
  { name: "Next.js", level: 88 },
  { name: "Node.js", level: 85 },
  { name: "Python", level: 78 },
  { name: "Rust", level: 45 },
];

const githubStats = [
  { label: "Contributions", value: "1,234", icon: Code },
  { label: "PRs Merged", value: "89", icon: GitPullRequest },
  { label: "Stars Earned", value: "234", icon: Star },
  { label: "Issues Closed", value: "156", icon: AlertCircle },
];

const topRepos = [
  { name: "react-hooks-library", stars: 234, forks: 45, language: "TypeScript", description: "A collection of useful React hooks" },
  { name: "dashboard-template", stars: 189, forks: 67, language: "TypeScript", description: "Admin dashboard template with modern UI" },
  { name: "api-client-sdk", stars: 156, forks: 34, language: "Python", description: "Type-safe API client generator" },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />
      
      <div className="pl-60">
        <Topbar title="Profile" subtitle="Manage your public profile" />
        
        <main className="max-w-5xl mx-auto px-6 py-6">
          {/* Profile Header */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
                A
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-zinc-100">Alex Chen</h1>
                  <Badge className="bg-violet-500/10 text-violet-400 border-0">
                    Pro Member
                  </Badge>
                </div>
                <p className="text-zinc-400 mb-4">Full-stack developer passionate about open source and building developer tools.</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Github className="w-4 h-4" />
                    alexchen
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    San Francisco, CA
                  </span>
                  <span className="flex items-center gap-1">
                    <LinkIcon className="w-4 h-4" />
                    alexchen.dev
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined March 2023
                  </span>
                </div>
              </div>
              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Edit Profile
              </Button>
            </div>
          </div>

          {/* GitHub Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {githubStats.map((stat) => (
              <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-violet-400" />
                </div>
                <div className="text-2xl font-bold text-zinc-100 mb-1">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Skills */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">Skills & Expertise</h2>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-zinc-300">{skill.name}</span>
                      <span className="text-sm text-zinc-500">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Repositories */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-zinc-100">Top Repositories</h2>
                <Button variant="ghost" size="sm" className="text-violet-400">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {topRepos.map((repo) => (
                  <div key={repo.name} className="p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-zinc-100 group-hover:text-violet-400 transition-colors">
                        {repo.name}
                      </h3>
                      <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 text-xs">
                        {repo.language}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-500 mb-2">{repo.description}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitPullRequest className="w-3 h-3" />
                        {repo.forks} forks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">Connected Accounts</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="divide-y divide-zinc-800">
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <Github className="w-5 h-5 text-zinc-300" />
                    </div>
                    <div>
                      <div className="font-medium text-zinc-100">GitHub</div>
                      <div className="text-sm text-zinc-500">Connected as @alexchen</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <Button variant="ghost" size="sm" className="text-zinc-400">
                      Disconnect
                    </Button>
                  </div>
                </div>
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <Code className="w-5 h-5 text-zinc-300" />
                    </div>
                    <div>
                      <div className="font-medium text-zinc-100">LinkedIn</div>
                      <div className="text-sm text-zinc-500">Not connected</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}
