"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  RefreshCw, 
  MapPin, 
  Link as LinkIcon, 
  Calendar,
  Star,
  GitFork,
  Users,
  Code2
} from "lucide-react";

interface Profile {
  username: string;
  name: string;
  bio: string;
  location: string;
  company: string;
  blog: string;
  member_since: string;
  public_repos: number;
  followers: number;
  following: number;
  languages: Record<string, number>;
  top_languages: string[];
  expertise: Array<{ area: string; level: string }>;
  completeness_score: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/profiles/${username}`);
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        setProfile({
          username: username,
          name: username,
          bio: "GitHub user",
          location: "Unknown",
          company: "",
          blog: "",
          member_since: "",
          public_repos: 0,
          followers: 0,
          following: 0,
          languages: {},
          top_languages: [],
          expertise: [],
          completeness_score: 0
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    const username = localStorage.getItem("username");
    
    if (username) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        await fetch(`${apiUrl}/api/v1/profiles/create/${username}`, {
          method: "POST"
        });
        await fetchProfile();
      } catch (error) {
        console.error("Failed to refresh profile:", error);
      }
    }
    
    setRefreshing(false);
  };

  const completenessItems = [
    { label: "Bio added", complete: !!profile?.bio },
    { label: "Location set", complete: !!profile?.location },
    { label: "Website linked", complete: !!profile?.blog },
    { label: "Active repos", complete: (profile?.public_repos || 0) >= 5 },
    { label: "Followers", complete: (profile?.followers || 0) >= 10 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">Manage your contributor profile</p>
        </div>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh from GitHub"}
        </Button>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-4xl">
                {profile?.username?.charAt(0).toUpperCase() || "?"}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">@{profile?.username}</h2>
                <p className="text-muted-foreground">{profile?.name}</p>
              </div>

              <p className="text-sm">{profile?.bio || "No bio provided"}</p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profile?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </span>
                )}
                {profile?.company && (
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {profile.company}
                  </span>
                )}
                {profile?.blog && (
                  <a 
                    href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Website
                  </a>
                )}
                {profile?.member_since && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(profile.member_since).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div>
                  <span className="font-bold text-xl">{profile?.public_repos || 0}</span>
                  <span className="text-muted-foreground text-sm ml-1">Repos</span>
                </div>
                <div>
                  <span className="font-bold text-xl">{profile?.followers || 0}</span>
                  <span className="text-muted-foreground text-sm ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-xl">{profile?.following || 0}</span>
                  <span className="text-muted-foreground text-sm ml-1">Following</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completeness */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Completeness</CardTitle>
          <CardDescription>Complete these items to improve your matches</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={profile?.completeness_score || 0} className="h-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {profile?.completeness_score || 0}% Complete
            </span>
            <Badge variant={profile && profile.completeness_score >= 80 ? "default" : "secondary"}>
              {profile && profile.completeness_score >= 80 ? "Excellent" : 
               profile && profile.completeness_score >= 50 ? "Good" : "Needs Work"}
            </Badge>
          </div>

          <div className="grid gap-2 pt-4">
            {completenessItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                {item.complete ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <span className="text-muted-foreground">○</span>
                )}
                <span className={item.complete ? "" : "text-muted-foreground"}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Languages & Expertise */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.top_languages && profile.top_languages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.top_languages.map((lang) => (
                  <Badge key={lang} variant="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No language data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.expertise && profile.expertise.length > 0 ? (
              <div className="space-y-2">
                {profile.expertise.map((exp, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span>{exp.area}</span>
                    <Badge variant={exp.level === "Expert" ? "default" : "secondary"}>
                      {exp.level}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No expertise data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
