"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gradient" | "secondary" | "destructive" | "outline" | "glow";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground",
      gradient: "bg-gradient-to-r from-violet-500 via-cyan-500 to-emerald-500 text-white",
      secondary: "bg-secondary text-secondary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
      outline: "border border-input bg-background",
      glow: "bg-violet-500/20 text-violet-400 border border-violet-500/30",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
          variants[variant],
          variant === "gradient" && "bg-size-200 animate-gradient-shift",
          variant === "glow" && "glow-sm",
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
