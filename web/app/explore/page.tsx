"use client";

import { useState } from "react";
import { Sidebar, Topbar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Star, 
  AlertCircle, 
  GitBranch,
  Flame,
  TrendingUp,
  Code,
  Users,
  ExternalLink
} from "lucide-react";

const languages = ["All", "TypeScript", "Python", "Rust", "Go", "JavaScript", "CSS"];

const projects = [
  { name: "vercel/next.js", stars: "115k", issues: 234, language: "TypeScript", description: "The React Framework for the Web", trending: true, activity: "Very Active" },
  { name: "microsoft/vscode", stars: "156k", issues: 892, language: "TypeScript", description: "Open Source VSCode Editor", trending: true, activity: "Very Active" },
  { name: "denoland/deno", stars: "94k", issues: 234, language: "Rust", description: "A modern runtime for JavaScript and TypeScript", trending: false, activity: "Active" },
  { name: "astral-sh/ruff", stars: "28k", issues: 156, language: "Rust", description: "An extremely fast Python linter and code formatter", trending: true, activity: "Very Active" },
  { name: "microsoft/TypeScript", stars: "98k", issues: 456, language: "TypeScript", description: "TypeScript is a superset of JavaScript", trending: false, activity: "Very Active" },
  { name: "pandas-dev/pandas", stars: "42k", issues: 1234, language: "Python", description: "Powerful data structures for data analysis", trending: false, activity: "Active" },
  { name: "golang/go", stars: "118k", issues: 2341, language: "Go", description: "The Go programming language", trending: false, activity: "Very Active" },
  { name: "shadcn/ui", stars: "32k", issues: 156, language: "TypeScript", description: "Beautifully designed components built with Radix UI", trending: true, activity: "Active" },
];

export default function ExplorePage() {
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((project) => {
    const matchesLanguage = selectedLanguage === "All" || project.language === selectedLanguage;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLanguage && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />
      
      <div className="pl-60">
        <Topbar title="Explore" subtitle="Discover new projects to contribute" />
        
        <main className="max-w-7xl mx-auto px-6 py-6">
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search projects, languages, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Language Filters */}
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedLanguage === lang
                      ? "bg-violet-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-100">Trending Repositories</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.filter(p => p.trending).map((project) => (
                <div 
                  key={project.name}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <GitBranch className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-100 group-hover:text-violet-400 transition-colors flex items-center gap-2">
                          {project.name}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-sm text-zinc-500">{project.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-orange-500/10 text-orange-400 border-0">
                      <Flame className="w-3 h-3 mr-1" />
                      Trending
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
                    <span className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-400">
                      {project.language}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="w-3 h-3" />
                      {project.activity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Projects */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Code className="w-4 h-4 text-violet-400" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-100">All Repositories</h2>
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">
                {filteredProjects.length} results
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <div 
                  key={project.name}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 text-xs">
                      {project.language}
                    </Badge>
                    {project.trending && (
                      <Badge className="bg-orange-500/10 text-orange-400 border-0 text-xs">
                        <Flame className="w-3 h-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-zinc-100 mb-1 group-hover:text-violet-400 transition-colors flex items-center gap-2">
                    {project.name}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-zinc-500 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {project.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {project.issues}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <Button size="sm" className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600">
                      View Details
                    </Button>
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
