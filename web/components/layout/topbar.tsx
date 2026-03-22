"use client";

import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6">
      {/* Left side */}
      <div>
        <h1 className="text-lg font-semibold text-zinc-100">{title}</h1>
        {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="w-9 h-9 text-zinc-400 hover:text-zinc-100">
          <Search className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="w-9 h-9 text-zinc-400 hover:text-zinc-100 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-violet-500 rounded-full" />
        </Button>
        <div className="w-px h-5 bg-zinc-800 mx-1" />
        <ThemeToggle />
      </div>
    </header>
  );
}
