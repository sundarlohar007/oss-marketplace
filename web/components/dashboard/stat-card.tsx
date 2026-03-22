"use client";

import { motion } from "framer-motion";
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
    icon: "text-violet-500",
    gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    icon: "text-cyan-500",
    gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    icon: "text-emerald-500",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
  },
  orange: {
    bg: "bg-orange-500/10",
    icon: "text-orange-500",
    gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
  },
};

export function StatCard({ label, value, change, changeType, icon: Icon, color }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative group">
        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`} />
        
        {/* Card */}
        <div className="relative p-5 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-white/10 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            {/* Icon */}
            <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center shadow-lg`}>
              <Icon className={`w-5 h-5 ${colors.icon}`} />
            </div>
            
            {/* Change Badge */}
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              changeType === "positive" ? "bg-emerald-500/10 text-emerald-500" :
              changeType === "negative" ? "bg-red-500/10 text-red-500" :
              "bg-white/10 text-white/70"
            }`}>
              {changeType === "positive" && <TrendingUp className="w-3 h-3" />}
              {changeType === "negative" && <TrendingDown className="w-3 h-3" />}
              {change}
            </div>
          </div>

          {/* Value */}
          <div className="space-y-1">
            <div className="text-3xl font-bold tracking-tight">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
