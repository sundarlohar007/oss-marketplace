"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Bell, 
  Settings,
  Search,
  Target,
  GitBranch,
  LayoutDashboard,
  ChevronDown
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/explore", label: "Explore", icon: Search },
  { href: "/dashboard/matches", label: "Matches", icon: Target },
  { href: "/dashboard/projects", label: "Projects", icon: GitBranch },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="flex h-14 items-center px-4 gap-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mr-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 via-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm hidden sm:block">OSS Marketplace</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-0.5 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-white/10 text-white shadow-sm" 
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative w-9 h-9">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
          </Button>
          
          <Button variant="ghost" size="icon" className="w-9 h-9">
            <Settings className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-xs shadow-lg shadow-violet-500/20">
              A
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-medium">Alex Chen</span>
              <span className="text-[10px] text-muted-foreground">Pro Plan</span>
            </div>
            <ChevronDown className="w-3 h-3 text-muted-foreground hidden lg:block" />
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
