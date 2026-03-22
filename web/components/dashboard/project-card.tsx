"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Star, AlertCircle, ExternalLink, Flame } from "lucide-react";

interface ProjectCardProps {
  name: string;
  stars: string;
  match: number;
  issues: number;
  language: string;
  description?: string;
  trending?: boolean;
}

export function ProjectCard({ name, stars, match, issues, language, description, trending }: ProjectCardProps) {
  return (
    <Link href={`/matches?repo=${encodeURIComponent(name)}`}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer h-full">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          {trending && (
            <Badge className="bg-orange-500/10 text-orange-400 border-0 text-xs">
              <Flame className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
          <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 text-xs">
            {language}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-zinc-100 mb-1 flex items-center gap-2 group">
          {name}
          <ExternalLink className="w-3 h-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-zinc-500 mb-3 line-clamp-2">{description}</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-500" />
            {stars}
          </span>
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {issues} issues
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              {match}%
            </span>
            <span className="text-xs text-zinc-500">match</span>
          </div>
          <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            View
          </Button>
        </div>
      </div>
    </Link>
  );
}
