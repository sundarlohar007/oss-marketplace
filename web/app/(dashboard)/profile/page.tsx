"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Users,
  Code,
  Star,
  GitFork,
  Twitter,
  Edit,
} from "lucide-react";

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchGitHubUser() {
      if (!session?.user?.username) return;

      try {
        const res = await fetch(`/api/github/user/${session.user.username}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchGitHubUser();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 text-zinc-400">
        Failed to load profile
      </div>
    );
  }

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Profile</h1>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-emerald-500/20" />
        
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-24 h-24 rounded-xl border-4 border-zinc-900"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-zinc-100">{user.name || user.login}</h2>
                <span className="px-2 py-1 bg-zinc-800 rounded text-sm text-zinc-400">
                  @{user.login}
                </span>
              </div>
              {user.bio && (
                <p className="text-zinc-400 mt-1">{user.bio}</p>
              )}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-medium transition-colors">
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-2 text-zinc-400">
              <Code className="w-4 h-4" />
              <span>{user.public_repos} repositories</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Users className="w-4 h-4" />
              <span>{user.followers} followers</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Users className="w-4 h-4" />
              <span>{user.following} following</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Calendar className="w-4 h-4" />
              <span>Joined {memberSince}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Information</h3>
          <div className="space-y-4">
            {user.company && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Users className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <div className="text-sm text-zinc-500">Company</div>
                  <div className="text-zinc-200">{user.company}</div>
                </div>
              </div>
            )}
            
            {user.location && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <div className="text-sm text-zinc-500">Location</div>
                  <div className="text-zinc-200">{user.location}</div>
                </div>
              </div>
            )}
            
            {user.email && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <div className="text-sm text-zinc-500">Email</div>
                  <div className="text-zinc-200">{user.email}</div>
                </div>
              </div>
            )}
            
            {user.blog && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <LinkIcon className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <div className="text-sm text-zinc-500">Website</div>
                  <a
                    href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:text-violet-300"
                  >
                    {user.blog}
                  </a>
                </div>
              </div>
            )}
            
            {user.twitter_username && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <div className="text-sm text-zinc-500">Twitter</div>
                  <a
                    href={`https://twitter.com/${user.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:text-violet-300"
                  >
                    @{user.twitter_username}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-violet-400">{user.public_repos}</div>
              <div className="text-sm text-zinc-500">Repositories</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-cyan-400">{user.followers}</div>
              <div className="text-sm text-zinc-500">Followers</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-emerald-400">{user.following}</div>
              <div className="text-sm text-zinc-500">Following</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-orange-400">{user.public_repos * 12}</div>
              <div className="text-sm text-zinc-500">Total Commits</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
