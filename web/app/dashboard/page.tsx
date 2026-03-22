"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, FolderKanban, TrendingUp, ArrowRight, GitFork, Star, Bug } from "lucide-react";

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
        matches: matches.length || 12,
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
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Following",
      value: stats.projects,
      description: "Projects you're tracking",
      icon: FolderKanban,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Activity Level",
      value: stats.activity,
      description: "Based on recent contributions",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ];

  const activities = [
    { text: "Matched with facebook/react", time: "2 hours ago", type: "match" },
    { text: "Profile updated successfully", time: "5 hours ago", type: "profile" },
    { text: "New project followed: vercel/next.js", time: "1 day ago", type: "follow" },
    { text: "First match found!", time: "2 days ago", type: "milestone" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{localStorage.getItem("username") ? `, @${localStorage.getItem("username")}` : ""}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your OSS journey
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Matches */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Top Matches</CardTitle>
                <CardDescription>Projects that best match your skills</CardDescription>
              </div>
              <Link href="/dashboard/matches">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : matches.length > 0 ? (
              matches.slice(0, 5).map((match) => (
                <Link 
                  key={match.id || match.project_name} 
                  href={match.url || "#"}
                  className="block"
                >
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{match.project_name}</p>
                        <Badge variant={match.score >= 80 ? "default" : "secondary"}>
                          {match.score}% match
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" /> {match.stars?.toLocaleString() || 0}
                        </span>
                        {match.language && (
                          <span>{match.language}</span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No matches yet. Find projects that need your skills!
                </p>
                <Link href="/explore">
                  <Button>Find Matches</Button>
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
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Link href="/explore">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <Target className="h-6 w-6" />
              <span>Find New Matches</span>
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <GitFork className="h-6 w-6" />
              <span>Update Profile</span>
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <Bug className="h-6 w-6" />
              <span>Find Good First Issues</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
