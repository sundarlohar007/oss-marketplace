"use client";

import { Sidebar, Topbar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Star, 
  AlertCircle, 
  Plus,
  ExternalLink,
  GitPullRequest,
  Eye,
  Users,
  Calendar
} from "lucide-react";

const watchedProjects = [
  { 
    name: "vercel/next.js", 
    stars: "115k", 
    issues: 234, 
    language: "TypeScript", 
    yourPRs: 3,
    yourIssues: 5,
    lastActivity: "2h ago"
  },
  { 
    name: "shadcn/ui", 
    stars: "32k", 
    issues: 156, 
    language: "TypeScript", 
    yourPRs: 7,
    yourIssues: 12,
    lastActivity: "5h ago"
  },
  { 
    name: "tanstack/query", 
    stars: "22k", 
    issues: 67, 
    language: "TypeScript", 
    yourPRs: 2,
    yourIssues: 3,
    lastActivity: "1d ago"
  },
];

const yourContributions = [
  { 
    repo: "vercel/next.js",
    type: "PR",
    title: "feat: Add streaming SSR support for app router",
    status: "merged",
    date: "2 days ago"
  },
  { 
    repo: "shadcn/ui",
    type: "PR",
    title: "fix: Resolve accordion animation flicker",
    status: "merged",
    date: "5 days ago"
  },
  { 
    repo: "tanstack/query",
    type: "Issue",
    title: "feat: Add QueryObserver for suspense",
    status: "open",
    date: "1 week ago"
  },
  { 
    repo: "vercel/next.js",
    type: "Issue",
    title: "docs: Clarify middleware behavior",
    status: "closed",
    date: "2 weeks ago"
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />
      
      <div className="pl-60">
        <Topbar title="Projects" subtitle="Your contributions and watched repositories" />
        
        <main className="max-w-7xl mx-auto px-6 py-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                <Eye className="w-4 h-4 mr-2" />
                Watch New
              </Button>
              <Button className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Repository
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Calendar className="w-4 h-4" />
              Last synced 5 minutes ago
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-sm text-zinc-500">Watching</span>
              </div>
              <div className="text-2xl font-bold text-zinc-100">12</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <GitPullRequest className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-sm text-zinc-500">Your PRs</span>
              </div>
              <div className="text-2xl font-bold text-zinc-100">24</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-sm text-zinc-500">Stars Given</span>
              </div>
              <div className="text-2xl font-bold text-zinc-100">156</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-sm text-zinc-500">Following</span>
              </div>
              <div className="text-2xl font-bold text-zinc-100">89</div>
            </div>
          </div>

          {/* Watched Projects */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">Watched Repositories</h2>
            <div className="space-y-4">
              {watchedProjects.map((project) => (
                <div 
                  key={project.name}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <GitBranch className="w-6 h-6 text-zinc-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-zinc-100 group-hover:text-violet-400 transition-colors flex items-center gap-2">
                            {project.name}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h3>
                          <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 text-xs">
                            {project.language}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {project.stars}
                          </span>
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {project.issues} issues
                          </span>
                          <span className="text-zinc-600">
                            Last active {project.lastActivity}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-emerald-400">{project.yourPRs}</div>
                        <div className="text-xs text-zinc-500">PRs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-violet-400">{project.yourIssues}</div>
                        <div className="text-xs text-zinc-500">Issues</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Contributions */}
          <div>
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">Your Contributions</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="divide-y divide-zinc-800">
                {yourContributions.map((contribution, i) => (
                  <div key={i} className="px-5 py-4 hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className={
                          contribution.type === "PR" 
                            ? contribution.status === "merged"
                              ? "bg-emerald-500/10 text-emerald-400 border-0"
                              : "bg-blue-500/10 text-blue-400 border-0"
                            : contribution.status === "open"
                              ? "bg-violet-500/10 text-violet-400 border-0"
                              : "bg-zinc-700 text-zinc-400 border-0"
                        }>
                          {contribution.type}
                        </Badge>
                        <div>
                          <p className="font-medium text-zinc-100 group-hover:text-violet-400 transition-colors">
                            {contribution.title}
                          </p>
                          <p className="text-sm text-zinc-500">{contribution.repo}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={
                          contribution.status === "merged"
                            ? "bg-emerald-500/10 text-emerald-400 border-0"
                            : contribution.status === "open"
                              ? "bg-violet-500/10 text-violet-400 border-0"
                              : "bg-zinc-700 text-zinc-400 border-0"
                        }>
                          {contribution.status}
                        </Badge>
                        <span className="text-sm text-zinc-500">{contribution.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}
