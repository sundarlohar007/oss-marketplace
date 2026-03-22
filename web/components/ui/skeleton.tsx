"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "text" | "card";
  className?: string;
}

export function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted rounded-md",
        "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent",
        "after:animate-shimmer",
        variant === "circular" && "rounded-full aspect-square",
        variant === "text" && "h-4 w-full rounded",
        variant === "card" && "h-48 w-full rounded-xl",
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="space-y-3 p-4 rounded-xl border bg-card">
      <Skeleton className="h-4 w-3/4" variant="text" />
      <Skeleton className="h-4 w-full" variant="text" />
      <Skeleton className="h-4 w-1/2" variant="text" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="h-12 w-12 rounded-full" variant="circular" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-32" variant="text" />
        <Skeleton className="h-3 w-48" variant="text" />
      </div>
    </div>
  );
}
