"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { SkeletonProfile } from "@/components/ui/skeleton";
import { Target, FolderKanban, TrendingUp, ArrowRight, GitFork, Star, Bug, Sparkles } from "lucide-react";

interface Match {
  id: number;
  project_name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
  score: number;
  matching_languages: string[];
}

interface Stats {
  matches: number;
  projects: number;
  activity: string;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  
  useEffect(() => {
    const duration = 1000;
    const steps = 20;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{display}</span>;
}

export default function DashboardPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [stats, setStats] = useState<Stats>({ matches: 0, projects: 0, activity: "Loading..." });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const username = localStorage.getItem("username");
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${apiUrl}/api/v1/matches/contributor/${username}?limit=5`);
        
        if (response.ok) {
          const data = await response.json();
          setMatches(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      }

      setStats({
        matches: 12,
        projects: 5,
        activity: "High"
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: "Your Matches",
      value: stats.matches,
      description: "Projects that match your skills",
      icon: Target,
      color: "violet",
    },
    {
      title: "Following",
      value: stats.projects,
      description: "Projects you're tracking",
      icon: FolderKanban,
      color: "cyan",
    },
    {
      title: "Activity Level",
      value: stats.activity,
      description: "Based on recent contributions",
      icon: TrendingUp,
      color: "emerald",
    }
  ];

  const activities = [
    { text: "Matched with facebook/react", time: "2 hours ago", type: "match" },
    { text: "Profile updated successfully", time: "5 hours ago", type: "profile" },
    { text: "New project followed: vercel/next.js", time: "1 day ago", type: "follow" },
    { text: "First match found!", time: "2 days ago", type: "milestone" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">OSS Marketplace</span>
          </Link>
          <ThemeToggle />
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Welcome */}
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back{localStorage.getItem("username") ? `, @${localStorage.getItem("username")}` : ""}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your OSS journey
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
            {statCards.map((stat, i) => (
              <Card key={stat.title} hover className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div 
                    className={`w-10 h-10 rounded-xl flex items-center justify-center
                      ${stat.color === 'violet' ? 'bg-violet-500/20 text-violet-400' : ''}
                      ${stat.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' : ''}
                      ${stat.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                    `}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {loading ? (
                      <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                    ) : typeof stat.value === 'number' ? (
                      <AnimatedNumber value={stat.value} />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
                {/* Gradient overlay */}
                <div className={`absolute bottom-0 left-0 right-0 h-1
                  ${stat.color === 'violet' ? 'bg-gradient-to-r from-violet-500 to-violet-400' : ''}
                  ${stat.color === 'cyan' ? 'bg-gradient-to-r from-cyan-500 to-cyan-400' : ''}
                  ${stat.color === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : ''}
                `} />
              </Card>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
            {/* Top Matches */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Top Matches</CardTitle>
                    <CardDescription>Projects that best match your skills</CardDescription>
                  </div>
                  <Link href="/explore">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View all <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <>
                    <SkeletonProfile />
                    <SkeletonProfile />
                    <SkeletonProfile />
                  </>
                ) : matches.length > 0 ? (
                  matches.slice(0, 5).map((match) => (
                    <Link 
                      key={match.id || match.project_name} 
                      href={match.url || "#"}
                      className="block group"
                    >
                      <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate group-hover:text-violet-400 transition-colors">
                              {match.project_name}
                            </p>
                            <Badge 
                              variant={match.score >= 80 ? "gradient" : "secondary"}
                              className="text-xs"
                            >
                              {match.score}% match
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> 
                              {match.stars?.toLocaleString() || 0}
                            </span>
                            {match.language && (
                              <span className="text-violet-400">{match.language}</span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Target className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      No matches yet. Find projects that need your skills!
                    </p>
                    <Link href="/explore">
                      <Button variant="glow">Find Matches</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest updates and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <Link href="/explore">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2 group">
                    <Target className="h-6 w-6 group-hover:text-violet-400 transition-colors" />
                    <span>Find New Matches</span>
                  </Button>
                </Link>
                <Link href="/dashboard/profile">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2 group">
                    <GitFork className="h-6 w-6 group-hover:text-cyan-400 transition-colors" />
                    <span>Update Profile</span>
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2 group">
                    <Bug className="h-6 w-6 group-hover:text-emerald-400 transition-colors" />
                    <span>Find Good First Issues</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
