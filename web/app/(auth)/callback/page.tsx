"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function CallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");

  useEffect(() => {
    const handleCallback = async () => {
      if (errorParam) {
        setStatus("error");
        setError(errorParam === "access_denied" 
          ? "You denied access to GitHub. Please try again." 
          : errorParam
        );
        return;
      }

      if (!code) {
        setStatus("error");
        setError("No authorization code received");
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${apiUrl}/api/v1/auth/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const data = await response.json();
        
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("user_id", data.user_id.toString());
          localStorage.setItem("username", data.username);
        }

        setStatus("success");
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    handleCallback();
  }, [code, errorParam, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>
            {status === "loading" && "Connecting to GitHub..."}
            {status === "success" && "Success!"}
            {status === "error" && "Authentication Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we verify your account"}
            {status === "success" && "You've been signed in successfully!"}
            {status === "error" && error}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {status === "loading" && (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          )}
          {status === "success" && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✅</span>
              </div>
              <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
            </div>
          )}
          {status === "error" && (
            <div className="text-center">
              <Button onClick={() => router.push("/login")}>
                Return to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
