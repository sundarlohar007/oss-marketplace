"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Star, 
  Bug, 
  ExternalLink,
  Target,
  Users,
  TrendingUp,
  Flame,
  Filter
} from "lucide-react";

interface Project {
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
}

interface Contributor {
  username: string;
  name: string;
  avatar_url: string;
  followers: number;
  public_repos: number;
  score: number;
  matching_languages: string[];
}

type Tab = "projects" | "contributors" | "hot";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
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
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Explore</h1>
          <p className="text-muted-foreground mt-1">
            Discover projects and contributors that need you
          </p>

          {/* Search */}
          <div className="mt-6 relative max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search projects, languages, or contributors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="gap-2"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === "projects" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Popular Projects</h2>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    No projects found. Try a different search.
                  </p>
                  <Button onClick={fetchData}>Refresh</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => (
                  <Card key={project.name || index} className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">
                            {project.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">
                            {project.description || "No description"}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">
                          {project.language || "Mixed"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" /> 
                            {project.stars?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <a href={project.url || "#"} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="gap-1">
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
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "contributors" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Top Contributors</h2>
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Contributor discovery coming soon! Connect your GitHub account to see personalized recommendations.
                </p>
                <Button variant="outline">Sign in to see matches</Button>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "hot" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Projects That Need Help</h2>
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Flame className="h-5 w-5" />
                  Hot Projects
                </CardTitle>
                <CardDescription>
                  These projects have high issue counts and need contributors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sign in to see projects that are actively looking for help. Our AI matches you with projects based on your skills and interests.
                </p>
                <Button className="mt-4 gap-2">
                  <Target className="h-4 w-4" />
                  Find Your Match
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
