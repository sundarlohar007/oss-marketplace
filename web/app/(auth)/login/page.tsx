"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Zap, Users, Heart, ArrowRight } from "lucide-react";

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
      icon: <Users className="w-6 h-6" />,
      title: "Find Perfect Matches",
      description: "Our AI matches you with projects that need your exact skills"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Save Time",
      description: "No more searching. Get curated matches delivered to you"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Build Relationships",
      description: "Connect with maintainers and contributors who share your interests"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">🌍</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold">OSS Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Connect maintainers with perfect contributors
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your dashboard and find your perfect match
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* GitHub Login */}
            <Button 
              className="w-full gap-2" 
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
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
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
            </Button>

            {/* Terms */}
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-muted">
              <CardContent className="flex items-start gap-4 p-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-bold">5K+</div>
            <div className="text-xs text-muted-foreground">Matches Made</div>
          </div>
          <div>
            <div className="text-2xl font-bold">1K+</div>
            <div className="text-xs text-muted-foreground">Active Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold">50+</div>
            <div className="text-xs text-muted-foreground">Projects</div>
          </div>
        </div>
      </div>
    </div>
  );
}
