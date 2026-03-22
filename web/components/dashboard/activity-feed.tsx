"use client";

import { Badge } from "@/components/ui/badge";
import { Target, GitPullRequest, AlertCircle, Star, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ActivityItem {
  id: string;
  type: "match" | "pr" | "issue" | "star";
  title: string;
  project?: string;
  time: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  title?: string;
}

const typeConfig = {
  match: { icon: Target, bg: "bg-violet-500/10", text: "text-violet-400" },
  pr: { icon: GitPullRequest, bg: "bg-emerald-500/10", text: "text-emerald-400" },
  issue: { icon: AlertCircle, bg: "bg-cyan-500/10", text: "text-cyan-400" },
  star: { icon: Star, bg: "bg-yellow-500/10", text: "text-yellow-400" },
};

export function ActivityFeed({ items, title = "Recent Activity" }: ActivityFeedProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-100">{title}</h2>
        <Badge className="bg-violet-500/10 text-violet-400 border-0 text-xs">
          {items.length} new
        </Badge>
      </div>
      <div className="divide-y divide-zinc-800/50">
        {items.map((item) => {
          const config = typeConfig[item.type];
          const Icon = config.icon;
          
          return (
            <div 
              key={item.id} 
              className="px-5 py-3 hover:bg-zinc-800/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${config.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-300 group-hover:text-zinc-100">
                    {item.title}
                    {item.project && <span className="text-zinc-500 ml-1">{item.project}</span>}
                  </p>
                  <p className="text-xs text-zinc-600 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
