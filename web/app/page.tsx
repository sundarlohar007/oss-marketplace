"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Users, 
  GitBranch, 
  Heart, 
  Zap, 
  ArrowRight, 
  Star, 
  ChevronRight,
  Sparkles,
  Target,
  Handshake
} from "lucide-react";
import { useEffect, useState } from "react";

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    const duration = 2000;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-cyan-500 to-emerald-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">OSS Marketplace</span>
          </motion.div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Explore
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="glow" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <Badge variant="gradient" className="px-4 py-1.5 text-sm font-medium">
                <Star className="w-3 h-3 mr-1.5 fill-current" />
                Open Source • 100% Free Forever
              </Badge>
            </motion.div>
            
            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              Connect Maintainers with{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 animate-gradient-shift">
                Perfect Contributors
              </span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              variants={itemVariants}
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              The intelligent matchmaking platform for open source. We analyze skills, 
              interests, and project needs to create perfect matches that benefit everyone.
            </motion.p>
            
            {/* CTAs */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link href="/login">
                <Button variant="glow" size="lg" className="w-full sm:w-auto text-base px-8 glow-button">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Matching
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 group">
                  Explore Projects
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Floating shapes */}
          <motion.div
            className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-violet-500/20 blur-[100px] animate-float"
          />
          <motion.div
            className="absolute bottom-10 -right-20 w-64 h-64 rounded-full bg-cyan-500/20 blur-[100px] animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
          >
            {[
              { label: "Matches Made", value: 5000, suffix: "+" },
              { label: "Active Projects", value: 1200, suffix: "+" },
              { label: "Contributors", value: 8000, suffix: "+" },
              { label: "Success Rate", value: 94, suffix: "%" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Problem */}
            <motion.div variants={itemVariants}>
              <Card hover className="h-full border-red-500/20 bg-red-500/5">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-6">
                    <Heart className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-400 mb-4">The Problem</h3>
                  <ul className="space-y-4">
                    {[
                      "Maintainers have hundreds of issues with no help",
                      "Good developers want to contribute but can't find projects",
                      "Perfect matches never happen",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Solution */}
            <motion.div variants={itemVariants}>
              <Card hover className="h-full border-emerald-500/20 bg-emerald-500/5">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-emerald-400 mb-4">Our Solution</h3>
                  <ul className="space-y-4">
                    {[
                      "AI-powered matching based on skills & interests",
                      "Project health analysis to find projects needing help",
                      "Personalized outreach to connect the right people",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="gradient" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Three Steps to Your Perfect Match
            </h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Users className="w-7 h-7" />,
                title: "1. Create Your Profile",
                description: "Connect your GitHub account. We analyze your skills, interests, and contribution history.",
                color: "violet",
              },
              {
                icon: <Target className="w-7 h-7" />,
                title: "2. Discover Matches",
                description: "Our algorithm finds projects or contributors that align perfectly with your goals.",
                color: "cyan",
              },
              {
                icon: <Handshake className="w-7 h-7" />,
                title: "3. Connect & Build",
                description: "Reach out with personalized messages and start building amazing things together.",
                color: "emerald",
              },
            ].map((step, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card hover className="h-full text-center group">
                  <CardContent className="p-8">
                    <div 
                      className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center
                        ${step.color === 'violet' ? 'bg-violet-500/20 text-violet-400' : ''}
                        ${step.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' : ''}
                        ${step.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                      `}
                    >
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-emerald-500/10" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 via-cyan-500 to-emerald-500 mx-auto mb-8 flex items-center justify-center animate-float">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of maintainers and contributors who are building the future of open source together.
            </p>
            <Link href="/login">
              <Button variant="glow" size="lg" className="text-lg px-10 glow-button">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">OSS Marketplace</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="https://github.com/sundarlohar007/oss-marketplace" className="hover:text-foreground transition-colors">
                GitHub
              </Link>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Built with passion for the open source community
          </p>
        </div>
      </footer>
    </div>
  );
}
