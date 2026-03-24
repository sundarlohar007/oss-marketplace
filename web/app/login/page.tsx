"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Github, ArrowRight, Sparkles, Users, Heart } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-zinc-950 to-zinc-950" />
      
      <div className="relative min-h-screen flex flex-col">
        <header className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-zinc-100">OSS Marketplace</span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-lg w-full text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-zinc-100 mb-4">
                Match. Connect.{" "}
                <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Build Together.
                </span>
              </h1>
              <p className="text-lg text-zinc-400">
                The intelligent matchmaking platform for open source maintainers and contributors.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-violet-400" />
                  </div>
                  <div className="text-2xl font-bold text-zinc-100">847K+</div>
                  <div className="text-sm text-zinc-500">Open Issues</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-zinc-100">2.1M+</div>
                  <div className="text-sm text-zinc-500">Contributors</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-zinc-100">98%</div>
                  <div className="text-sm text-zinc-500">Mismatch Rate</div>
                </div>
              </div>

              <button
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Github className="w-5 h-5" />
                Continue with GitHub
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="mt-4 text-sm text-zinc-500">
                We only read your public profile data. No write access required.
              </p>
            </div>

            <div className="text-sm text-zinc-500">
              <span>Free forever.</span>
              <span className="mx-2">·</span>
              <span>No signup required.</span>
              <span className="mx-2">·</span>
              <span>Privacy first.</span>
            </div>
          </div>
        </main>

        <footer className="p-6 text-center text-sm text-zinc-600">
          © 2024 OSS Marketplace. Built with ❤️ for developers.
        </footer>
      </div>
    </div>
  );
}
