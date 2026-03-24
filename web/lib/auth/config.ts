import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { createClient } from "@supabase/supabase-js";
import "@/lib/auth/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const githubProfile = profile as Record<string, any>;
      if (!githubProfile?.id) return false;

      const githubId = parseInt(githubProfile.id);

      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("github_id", githubId)
        .single();

      if (!existingUser) {
        await supabase.from("users").insert({
          github_id: githubId,
          username: githubProfile.login,
          email: user.email,
          avatar_url: githubProfile.avatar_url,
          name: githubProfile.name,
          bio: githubProfile.bio,
          company: githubProfile.company,
          location: githubProfile.location,
          blog: githubProfile.blog,
          twitter_username: githubProfile.twitter_username,
          public_repos: githubProfile.public_repos || 0,
          followers: githubProfile.followers || 0,
          following: githubProfile.following || 0,
        });
      } else {
        await supabase
          .from("users")
          .update({
            username: githubProfile.login,
            email: user.email,
            avatar_url: githubProfile.avatar_url,
            name: githubProfile.name,
            bio: githubProfile.bio,
            company: githubProfile.company,
            location: githubProfile.location,
            blog: githubProfile.blog,
            twitter_username: githubProfile.twitter_username,
            public_repos: githubProfile.public_repos || 0,
            followers: githubProfile.followers || 0,
            following: githubProfile.following || 0,
            last_synced: new Date().toISOString(),
          })
          .eq("github_id", githubId);
      }

      return true;
    },
    async jwt({ token, account, profile }) {
      const githubProfile = profile as Record<string, any>;
      if (account && githubProfile) {
        token.githubId = parseInt(githubProfile.id);
        token.username = githubProfile.login;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).githubId = token.githubId;
        (session.user as any).username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
