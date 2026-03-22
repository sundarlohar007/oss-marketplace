"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Search, 
  Star, 
  ExternalLink,
  Target,
  Users,
  Flame,
  Filter,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface Project {
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
}

type Tab = "projects" | "contributors" | "hot";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${apiUrl}/api/v1/projects/search/discover?limit=12`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
    }

    setLoading(false);
  };

  const tabs = [
    { id: "projects" as Tab, label: "Popular Projects", icon: Star },
    { id: "contributors" as Tab, label: "Top Contributors", icon: Users },
    { id: "hot" as Tab, label: "Need Contributors", icon: Flame },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">OSS Marketplace</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="glow" size="sm">Sign In</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover open source projects and find your perfect match based on skills, interests, and goals.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-xl mx-auto mb-8"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search projects, languages, or contributors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 text-base bg-card/50 backdrop-blur-sm border-border/50 focus:border-violet-500/50 focus:ring-violet-500/20"
          />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-8 justify-center"
        >
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "glow" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={loading ? "hidden" : "visible"}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {activeTab === "projects" && (
            <>
              {loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : projects.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      No projects found. Try a different search.
                    </p>
                    <Button onClick={fetchData}>Refresh</Button>
                  </CardContent>
                </Card>
              ) : (
                projects.map((project, index) => (
                  <motion.div key={project.name || index} variants={itemVariants}>
                    <Card hover className="h-full group">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate group-hover:text-violet-400 transition-colors">
                              {project.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 mt-1">
                              {project.description || "No description"}
                            </CardDescription>
                          </div>
                          <Badge variant="gradient" className="flex-shrink-0">
                            {project.language || "Mixed"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> 
                              {project.stars?.toLocaleString() || 0}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <a href={project.url || "#"} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </a>
                            <Button size="sm" className="gap-1">
                              <Target className="h-4 w-4" />
                              Match
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </>
          )}

          {activeTab === "contributors" && (
            <Card className="col-span-full">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Contributor Discovery</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Sign in to see personalized contributor recommendations based on your project needs.
                </p>
                <Link href="/login">
                  <Button variant="glow">Sign in to Continue</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {activeTab === "hot" && (
            <Card className="col-span-full border-orange-500/20">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 mx-auto mb-4 flex items-center justify-center">
                  <Flame className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Hot Projects</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  These projects have high issue counts and are actively looking for contributors.
                </p>
                <Link href="/login">
                  <Button variant="glow" className="gap-2">
                    <Target className="h-4 w-4" />
                    Find Your Match
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
