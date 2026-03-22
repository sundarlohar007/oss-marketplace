"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  GitFork, 
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw
} from "lucide-react";

interface Project {
  id: number;
  full_name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  health_score: number;
  open_issues: number;
  github_url: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newProject, setNewProject] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/projects?limit=50`);
      
      if (response.ok) {
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }

    setLoading(false);
  };

  const handleAddProject = async () => {
    if (!newProject || !newProject.includes("/")) {
      return;
    }

    setAdding(true);
    const [owner, repo] = newProject.split("/");
    const userId = localStorage.getItem("user_id");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/projects/add/${owner}/${repo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });
      
      if (response.ok) {
        await fetchProjects();
        setNewProject("");
      }
    } catch (error) {
      console.error("Failed to add project:", error);
    }

    setAdding(false);
  };

  const handleDelete = async (projectId: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      await fetch(`${apiUrl}/api/v1/projects/${projectId}`, {
        method: "DELETE"
      });
      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <p className="text-muted-foreground">
          Track projects you're interested in
        </p>
      </div>

      {/* Add Project */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="owner/repository (e.g., facebook/react)"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <Button 
              onClick={handleAddProject} 
              disabled={adding || !newProject.includes("/")}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {adding ? "Adding..." : "Add Project"}
            </Button>
            <Button variant="outline" onClick={fetchProjects} className="gap-2">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No projects tracked yet. Add your first project above!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{project.full_name}</h3>
                      <Badge variant="secondary">
                        Health: {project.health_score}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {project.description || "No description"}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" /> {project.stars?.toLocaleString() || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="h-4 w-4" /> {project.forks?.toLocaleString() || 0}
                      </span>
                      <span className="px-2 py-0.5 bg-muted rounded text-xs">
                        {project.language || "Unknown"}
                      </span>
                      <span>{project.open_issues || 0} open issues</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={project.github_url || "#"} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-1">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
