"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* Base gradient */}
      <div 
        className={`absolute inset-0 ${
          isDark 
            ? "bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" 
            : "bg-gradient-to-br from-zinc-50 via-white to-zinc-100"
        }`} 
      />
      
      {/* Animated orbs - Dark mode */}
      {isDark && (
        <>
          <motion.div
            className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-violet-500/20 blur-[120px]"
            animate={{
              x: [0, 100, 50],
              y: [0, -50, 25],
              scale: [1, 1.2, 0.9],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-cyan-500/15 blur-[120px]"
            animate={{
              x: [0, -80, 40],
              y: [0, 60, -30],
              scale: [1, 0.9, 1.1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 5,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[150px]"
            animate={{
              x: [0, 50, -25],
              y: [0, -30, 15],
              scale: [1, 1.1, 0.95],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 10,
            }}
          />
        </>
      )}
      
      {/* Animated orbs - Light mode */}
      {!isDark && (
        <>
          <motion.div
            className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-violet-200/40 blur-[120px]"
            animate={{
              x: [0, 80, 40],
              y: [0, -40, 20],
              scale: [1, 1.1, 0.95],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-cyan-200/30 blur-[120px]"
            animate={{
              x: [0, -60, 30],
              y: [0, 50, -25],
              scale: [1, 0.9, 1.05],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 5,
            }}
          />
        </>
      )}
      
      {/* Grid pattern overlay */}
      <div 
        className={`absolute inset-0 ${
          isDark 
            ? "opacity-[0.03]" 
            : "opacity-[0.02]"
        }`}
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
      
      {/* Noise texture */}
      <div 
        className={`absolute inset-0 ${isDark ? "opacity-[0.015]" : "opacity-[0.02]"}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
