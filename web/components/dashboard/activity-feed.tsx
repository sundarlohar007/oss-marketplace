"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  GitPullRequest, 
  AlertCircle, 
  Star,
  MessageSquare,
  CheckCircle2,
  Clock,
  LucideIcon
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "match" | "pr" | "issue" | "star" | "comment" | "merged";
  title: string;
  description?: string;
  time: string;
  project?: string;
}

const activityConfig = {
  match: {
    icon: Target,
    color: "violet",
    bgColor: "bg-violet-500/10",
    iconColor: "text-violet-500",
  },
  pr: {
    icon: GitPullRequest,
    color: "emerald",
    bgColor: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  issue: {
    icon: AlertCircle,
    color: "cyan",
    bgColor: "bg-cyan-500/10",
    iconColor: "text-cyan-500",
  },
  star: {
    icon: Star,
    color: "yellow",
    bgColor: "bg-yellow-500/10",
    iconColor: "text-yellow-500",
  },
  comment: {
    icon: MessageSquare,
    color: "blue",
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  merged: {
    icon: CheckCircle2,
    color: "violet",
    bgColor: "bg-violet-500/10",
    iconColor: "text-violet-500",
  },
};

interface ActivityFeedProps {
  items: ActivityItem[];
  title?: string;
  showViewAll?: boolean;
}

export function ActivityFeed({ items, title = "Recent Activity", showViewAll = true }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{title}</h3>
          {showViewAll && (
            <Badge variant="secondary" className="text-xs bg-violet-500/10 text-violet-400 border-violet-500/20">
              {items.length} new
            </Badge>
          )}
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-white/5">
        {items.map((item, index) => {
          const config = activityConfig[item.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${config.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">
                    <span className="font-medium group-hover:text-violet-400 transition-colors">{item.title}</span>
                    {item.project && (
                      <span className="text-muted-foreground ml-1">in {item.project}</span>
                    )}
                  </p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
                  )}
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
