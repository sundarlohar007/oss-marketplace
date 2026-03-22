"use client";

import { useState } from "react";
import { Sidebar, Topbar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Star, 
  AlertCircle, 
  GitBranch,
  Flame,
  Sparkles,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

const matches = [
  { 
    name: "vercel/next.js", 
    stars: "115k", 
    issues: 234, 
    language: "TypeScript", 
    match: 94, 
    description: "The React Framework for the Web",
    trending: true,
    reasons: ["Your React expertise matches 95%", "TypeScript is your top skill", "Active community participation"],
    goodFirstIssues: 23
  },
  { 
    name: "tailwindlabs/tailwindcss", 
    stars: "78k", 
    issues: 89, 
    language: "CSS", 
    match: 89, 
    description: "A utility-first CSS framework",
    trending: false,
    reasons: ["CSS architecture experience", "Design system knowledge", "Component patterns match"],
    goodFirstIssues: 12
  },
  { 
    name: "shadcn/ui", 
    stars: "32k", 
    issues: 156, 
    language: "TypeScript", 
    match: 87, 
    description: "Beautifully designed components built with Radix UI",
    trending: true,
    reasons: ["Component design experience", "React patterns expertise", "Accessibility focus aligns"],
    goodFirstIssues: 18
  },
  { 
    name: "tanstack/query", 
    stars: "22k", 
    issues: 67, 
    language: "TypeScript", 
    match: 82, 
    description: "Powerful asynchronous state management",
    trending: false,
    reasons: ["State management experience", "API integration skills", "Testing knowledge"],
    goodFirstIssues: 8
  },
  { 
    name: "microsoft/vscode", 
    stars: "156k", 
    issues: 892, 
    language: "TypeScript", 
    match: 78, 
    description: "Open Source VSCode Editor",
    trending: false,
    reasons: ["Editor extension experience", "TypeScript proficiency", "Debugging skills"],
    goodFirstIssues: 45
  },
  { 
    name: "denoland/deno", 
    stars: "94k", 
    issues: 234, 
    language: "Rust", 
    match: 65, 
    description: "A modern runtime for JavaScript and TypeScript",
    trending: false,
    reasons: ["JavaScript runtime interest", "Modern tooling appreciation", "Security focus"],
    goodFirstIssues: 15
  },
];

const matchFilters = ["All", "90%+", "80%+", "70%+", "60%+"];

export default function MatchesPage() {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const getMinMatch = (filter: string) => {
    switch (filter) {
      case "90%+": return 90;
      case "80%+": return 80;
      case "70%+": return 70;
      case "60%+": return 60;
      default: return 0;
    }
  };

  const filteredMatches = matches.filter((match) => match.match >= getMinMatch(selectedFilter));

  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />
      
      <div className="pl-60">
        <Topbar title="Matches" subtitle="Projects that match your skills" />
        
        <main className="max-w-7xl mx-auto px-6 py-6">
          {/* Match Filters */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              {matchFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedFilter === filter
                      ? "bg-violet-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">
              {filteredMatches.length} matches found
            </Badge>
          </div>

          {/* Top Match Highlight */}
          {filteredMatches.length > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-br from-violet-500/10 via-cyan-500/5 to-emerald-500/10 border border-violet-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-violet-500/20 text-violet-400 border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Best Match
                  </Badge>
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center">
                      <GitBranch className="w-8 h-8 text-zinc-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-zinc-100 mb-1">{filteredMatches[0].name}</h2>
                      <p className="text-zinc-400 mb-3">{filteredMatches[0].description}</p>
                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {filteredMatches[0].stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {filteredMatches[0].issues} issues
                        </span>
                        <span className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-400">
                          {filteredMatches[0].language}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          {filteredMatches[0].goodFirstIssues} good first issues
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                      {filteredMatches[0].match}%
                    </div>
                    <div className="text-sm text-zinc-500 mb-4">match score</div>
                    <Button className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600">
                      Start Contributing
                    </Button>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <h3 className="text-sm font-medium text-zinc-400 mb-3">Why this match?</h3>
                  <div className="flex flex-wrap gap-2">
                    {filteredMatches[0].reasons.map((reason, i) => (
                      <span key={i} className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-zinc-300">
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Matches */}
          <div>
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">All Matches</h2>
            <div className="space-y-4">
              {filteredMatches.slice(1).map((match) => (
                <div 
                  key={match.name}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <GitBranch className="w-6 h-6 text-zinc-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-zinc-100 group-hover:text-violet-400 transition-colors">
                            {match.name}
                          </h3>
                          {match.trending && (
                            <Badge className="bg-orange-500/10 text-orange-400 border-0 text-xs">
                              <Flame className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-zinc-500 mb-3">{match.description}</p>
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {match.stars}
                          </span>
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {match.issues} issues
                          </span>
                          <span className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-400">
                            {match.language}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            {match.goodFirstIssues} good first issues
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                          {match.match}%
                        </div>
                        <div className="text-xs text-zinc-500">match</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-800/50">
                    <div className="flex flex-wrap gap-2">
                      {match.reasons.map((reason, i) => (
                        <span key={i} className="px-2 py-1 bg-zinc-800/50 rounded text-xs text-zinc-400">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}
