"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Github, Zap, Users, Heart, ArrowRight, Sparkles, Shield } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    try {
      const callbackUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/auth/github`;
      window.location.href = callbackUrl;
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Find Perfect Matches",
      description: "Our AI matches you with projects that need your exact skills"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Save Time",
      description: "No more searching. Get curated matches delivered to you"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Build Relationships",
      description: "Connect with maintainers and contributors who share your interests"
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md space-y-8 relative z-10"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="text-center">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-cyan-500 to-emerald-500 mb-6"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight">OSS Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Connect maintainers with perfect contributors
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50 bg-card/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center">Welcome</CardTitle>
              <CardDescription className="text-center">
                Sign in to access your dashboard and find your perfect match
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* GitHub Login */}
              <Button
                className="w-full gap-2 bg-[#24292e] hover:bg-[#2f363d] text-white transition-all"
                size="lg"
                onClick={handleGitHubLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Github className="w-5 h-5" />
                )}
                Continue with GitHub
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              {/* Demo Mode */}
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => router.push("/explore")}
              >
                Continue as Guest
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {/* Terms */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3 h-3" />
                <span>Secured by GitHub OAuth</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div 
          variants={itemVariants}
          className="grid gap-4"
        >
          {features.map((feature, index) => (
            <motion.div key={index} whileHover={{ x: 5 }}>
              <Card hover className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center gap-8 text-center"
        >
          {[
            { label: "Matches Made", value: "5K+" },
            { label: "Active Users", value: "1K+" },
            { label: "Projects", value: "50+" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Background orbs */}
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-violet-500/10 blur-[120px] animate-float"
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] animate-float"
        style={{ animationDelay: "2s" }}
      />
    </div>
  );
}
