"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  color: "violet" | "cyan" | "emerald" | "orange";
}

const colorMap = {
  violet: {
    bg: "bg-violet-500/10",
    icon: "text-violet-400",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    icon: "text-cyan-400",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    icon: "text-emerald-400",
  },
  orange: {
    bg: "bg-orange-500/10",
    icon: "text-orange-400",
  },
};

export function StatCard({ label, value, change, changeType, icon: Icon, color }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all cursor-pointer group">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.bg)}>
          <Icon className={cn("w-5 h-5", colors.icon)} />
        </div>
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded-full",
          changeType === "positive" && "bg-emerald-500/10 text-emerald-400",
          changeType === "negative" && "bg-red-500/10 text-red-400",
          changeType === "neutral" && "bg-zinc-800 text-zinc-400"
        )}>
          {changeType === "positive" && <TrendingUp className="w-3 h-3 inline mr-1" />}
          {changeType === "negative" && <TrendingDown className="w-3 h-3 inline mr-1" />}
          {change}
        </span>
      </div>
      <div className="text-3xl font-bold text-zinc-100 mb-1">{value}</div>
      <div className="text-sm text-zinc-500">{label}</div>
    </div>
  );
}
