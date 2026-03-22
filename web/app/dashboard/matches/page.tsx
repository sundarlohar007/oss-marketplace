"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Star, 
  Bug, 
  ExternalLink, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Target,
  BookmarkPlus
} from "lucide-react";

interface Match {
  id: number;
  project_name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
  score: number;
  matching_languages: string[];
  health_score?: number;
  issues_count?: number;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const username = localStorage.getItem("username");
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(
          `${apiUrl}/api/v1/matches/contributor/${username}?limit=20&offset=${(page - 1) * 20}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setMatches(Array.isArray(data) ? data : []);
          setHasMore(Array.isArray(data) && data.length === 20);
        }
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      }

      setLoading(false);
    };

    fetchMatches();
  }, [page]);

  const filteredMatches = matches.filter((match) =>
    match.project_name?.toLowerCase().includes(search.toLowerCase()) ||
    match.description?.toLowerCase().includes(search.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Matches</h1>
          <p className="text-muted-foreground">
            Projects that match your skills and interests
          </p>
        </div>
        <Link href="/explore">
          <Button className="gap-2">
            <Target className="h-4 w-4" />
            Find New Matches
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search matches..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading matches...
        </div>
      ) : filteredMatches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No matches found</h3>
            <p className="text-muted-foreground mb-4">
              {search
                ? "Try adjusting your search"
                : "Start exploring to find your perfect matches!"}
            </p>
            <Link href="/explore">
              <Button>Explore Projects</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {filteredMatches.map((match) => (
              <Card key={match.id || match.project_name} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Project Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {match.project_name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {match.description || "No description available"}
                          </p>
                        </div>
                        <Badge 
                          variant={match.score >= 80 ? "default" : "secondary"}
                          className={`flex-shrink-0 ${getScoreColor(match.score)} bg-opacity-10`}
                        >
                          {match.score}% match
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {match.stars?.toLocaleString() || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bug className="h-4 w-4" />
                          {match.issues_count || 0} issues
                        </span>
                        {match.language && (
                          <span className="px-2 py-0.5 bg-muted rounded text-xs">
                            {match.language}
                          </span>
                        )}
                        {match.matching_languages?.length > 0 && (
                          <span className="flex items-center gap-1">
                            Matching: {match.matching_languages.slice(0, 3).join(", ")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={match.url || "#"} target="_blank">
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="gap-1">
                        <BookmarkPlus className="h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredMatches.length} matches
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="flex items-center px-3 text-sm">
                Page {page}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
