import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      githubId?: number;
      username?: string;
    } & DefaultSession["user"];
  }

  interface User {
    githubId?: number;
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    githubId?: number;
    username?: string;
  }
}
