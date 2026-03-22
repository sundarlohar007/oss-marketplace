"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Star, 
  AlertCircle, 
  ExternalLink,
  ArrowRight,
  Flame,
  Sparkles
} from "lucide-react";

interface MatchCardProps {
  name: string;
  stars: string;
  match: number;
  issues: number;
  language: string;
  description?: string;
  trending?: boolean;
  new?: boolean;
}

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500/10 text-blue-400",
  JavaScript: "bg-yellow-500/10 text-yellow-400",
  Python: "bg-green-500/10 text-green-400",
  Rust: "bg-orange-500/10 text-orange-400",
  Go: "bg-cyan-500/10 text-cyan-400",
  CSS: "bg-pink-500/10 text-pink-400",
  HTML: "bg-red-500/10 text-red-400",
};

export function MatchCard({ name, stars, match, issues, language, description, trending, new: isNew }: MatchCardProps) {
  const langColor = languageColors[language] || "bg-gray-500/10 text-gray-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/dashboard/matches?repo=${encodeURIComponent(name)}`} className="block group">
        <div className="relative p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
          {/* Top row: Badges */}
          <div className="flex items-center gap-2 mb-3">
            {isNew && (
              <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                New
              </Badge>
            )}
            {trending && (
              <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-xs">
                <Flame className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            )}
            <Badge className={langColor}>
              {language}
            </Badge>
          </div>

          {/* Project Name */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-base group-hover:text-violet-400 transition-colors flex items-center gap-2">
              {name}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
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
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-white/5"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#matchGradient)"
                    strokeWidth="3"
                    strokeDasharray={`${match}, 100`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                    {match}%
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">match score</div>
            </div>

            <Button 
              size="sm" 
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 shadow-lg shadow-violet-500/20"
            >
              View
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
