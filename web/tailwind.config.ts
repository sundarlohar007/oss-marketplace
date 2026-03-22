import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Background colors
    'bg-violet-50', 'bg-violet-100', 'bg-violet-200', 'bg-violet-300', 'bg-violet-400', 'bg-violet-500', 'bg-violet-600', 'bg-violet-700', 'bg-violet-800', 'bg-violet-900', 'bg-violet-950',
    'bg-cyan-50', 'bg-cyan-100', 'bg-cyan-200', 'bg-cyan-300', 'bg-cyan-400', 'bg-cyan-500', 'bg-cyan-600', 'bg-cyan-700', 'bg-cyan-800', 'bg-cyan-900', 'bg-cyan-950',
    'bg-emerald-50', 'bg-emerald-100', 'bg-emerald-200', 'bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-600', 'bg-emerald-700', 'bg-emerald-800', 'bg-emerald-900', 'bg-emerald-950',
    'bg-red-50', 'bg-red-100', 'bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500', 'bg-red-600', 'bg-red-700', 'bg-red-800', 'bg-red-900', 'bg-red-950',
    // Text colors
    'text-violet-50', 'text-violet-100', 'text-violet-200', 'text-violet-300', 'text-violet-400', 'text-violet-500', 'text-violet-600', 'text-violet-700', 'text-violet-800', 'text-violet-900', 'text-violet-950',
    'text-cyan-50', 'text-cyan-100', 'text-cyan-200', 'text-cyan-300', 'text-cyan-400', 'text-cyan-500', 'text-cyan-600', 'text-cyan-700', 'text-cyan-800', 'text-cyan-900', 'text-cyan-950',
    'text-emerald-50', 'text-emerald-100', 'text-emerald-200', 'text-emerald-300', 'text-emerald-400', 'text-emerald-500', 'text-emerald-600', 'text-emerald-700', 'text-emerald-800', 'text-emerald-900', 'text-emerald-950',
    'text-red-50', 'text-red-100', 'text-red-200', 'text-red-300', 'text-red-400', 'text-red-500', 'text-red-600', 'text-red-700', 'text-red-800', 'text-red-900', 'text-red-950',
    // Border colors
    'border-violet-50', 'border-violet-100', 'border-violet-200', 'border-violet-300', 'border-violet-400', 'border-violet-500', 'border-violet-600', 'border-violet-700', 'border-violet-800', 'border-violet-900', 'border-violet-950',
    'border-cyan-50', 'border-cyan-100', 'border-cyan-200', 'border-cyan-300', 'border-cyan-400', 'border-cyan-500', 'border-cyan-600', 'border-cyan-700', 'border-cyan-800', 'border-cyan-900', 'border-cyan-950',
    'border-emerald-50', 'border-emerald-100', 'border-emerald-200', 'border-emerald-300', 'border-emerald-400', 'border-emerald-500', 'border-emerald-600', 'border-emerald-700', 'border-emerald-800', 'border-emerald-900', 'border-emerald-950',
    'border-red-50', 'border-red-100', 'border-red-200', 'border-red-300', 'border-red-400', 'border-red-500', 'border-red-600', 'border-red-700', 'border-red-800', 'border-red-900', 'border-red-950',
    // Opacity variants
    'bg-violet-500/5', 'bg-violet-500/10', 'bg-violet-500/20', 'bg-violet-500/30', 'bg-violet-500/40', 'bg-violet-500/50',
    'bg-cyan-500/5', 'bg-cyan-500/10', 'bg-cyan-500/20', 'bg-cyan-500/30', 'bg-cyan-500/40', 'bg-cyan-500/50',
    'bg-emerald-500/5', 'bg-emerald-500/10', 'bg-emerald-500/20', 'bg-emerald-500/30', 'bg-emerald-500/40', 'bg-emerald-500/50',
    'bg-red-500/5', 'bg-red-500/10', 'bg-red-500/20', 'bg-red-500/30', 'bg-red-500/40', 'bg-red-500/50',
    // Gradient directions
    'bg-gradient-to-r', 'bg-gradient-to-l', 'bg-gradient-to-t', 'bg-gradient-to-b', 'bg-gradient-to-tr', 'bg-gradient-to-tl', 'bg-gradient-to-br', 'bg-gradient-to-bl',
    // Gradient from/to colors
    'from-violet-50', 'from-violet-100', 'from-violet-200', 'from-violet-300', 'from-violet-400', 'from-violet-500', 'from-violet-600', 'from-violet-700', 'from-violet-800', 'from-violet-900', 'from-violet-950',
    'from-cyan-50', 'from-cyan-100', 'from-cyan-200', 'from-cyan-300', 'from-cyan-400', 'from-cyan-500', 'from-cyan-600', 'from-cyan-700', 'from-cyan-800', 'from-cyan-900', 'from-cyan-950',
    'from-emerald-50', 'from-emerald-100', 'from-emerald-200', 'from-emerald-300', 'from-emerald-400', 'from-emerald-500', 'from-emerald-600', 'from-emerald-700', 'from-emerald-800', 'from-emerald-900', 'from-emerald-950',
    'from-red-50', 'from-red-100', 'from-red-200', 'from-red-300', 'from-red-400', 'from-red-500', 'from-red-600', 'from-red-700', 'from-red-800', 'from-red-900', 'from-red-950',
    'to-violet-50', 'to-violet-100', 'to-violet-200', 'to-violet-300', 'to-violet-400', 'to-violet-500', 'to-violet-600', 'to-violet-700', 'to-violet-800', 'to-violet-900', 'to-violet-950',
    'to-cyan-50', 'to-cyan-100', 'to-cyan-200', 'to-cyan-300', 'to-cyan-400', 'to-cyan-500', 'to-cyan-600', 'to-cyan-700', 'to-cyan-800', 'to-cyan-900', 'to-cyan-950',
    'to-emerald-50', 'to-emerald-100', 'to-emerald-200', 'to-emerald-300', 'to-emerald-400', 'to-emerald-500', 'to-emerald-600', 'to-emerald-700', 'to-emerald-800', 'to-emerald-900', 'to-emerald-950',
    'to-red-50', 'to-red-100', 'to-red-200', 'to-red-300', 'to-red-400', 'to-red-500', 'to-red-600', 'to-red-700', 'to-red-800', 'to-red-900', 'to-red-950',
    'via-violet-50', 'via-violet-100', 'via-violet-200', 'via-violet-300', 'via-violet-400', 'via-violet-500', 'via-violet-600', 'via-violet-700', 'via-violet-800', 'via-violet-900', 'via-violet-950',
    'via-cyan-50', 'via-cyan-100', 'via-cyan-200', 'via-cyan-300', 'via-cyan-400', 'via-cyan-500', 'via-cyan-600', 'via-cyan-700', 'via-cyan-800', 'via-cyan-900', 'via-cyan-950',
    'via-emerald-50', 'via-emerald-100', 'via-emerald-200', 'via-emerald-300', 'via-emerald-400', 'via-emerald-500', 'via-emerald-600', 'via-emerald-700', 'via-emerald-800', 'via-emerald-900', 'via-emerald-950',
    'via-red-50', 'via-red-100', 'via-red-200', 'via-red-300', 'via-red-400', 'via-red-500', 'via-red-600', 'via-red-700', 'via-red-800', 'via-red-900', 'via-red-950',
    // Border opacity
    'border-violet-500/20', 'border-emerald-500/20', 'border-red-500/20', 'border-cyan-500/20',
    // Animations
    'animate-gradient-shift',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        emerald: {
          DEFAULT: "#10b981",
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        violet: {
          DEFAULT: "#8b5cf6",
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        cyan: {
          DEFAULT: "#06b6d4",
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          950: "#083344",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-violet-cyan": "linear-gradient(135deg, hsl(262 83% 58%) 0%, hsl(189 94% 43%) 100%)",
        "gradient-violet-emerald": "linear-gradient(135deg, hsl(262 83% 58%) 0%, hsl(160 84% 39%) 100%)",
      },
      boxShadow: {
        "glow-violet": "0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)",
        "glow-emerald": "0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.2)",
        "glow-button": "0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.1)",
        "glow-sm": "0 0 10px rgba(139, 92, 246, 0.3)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        "glass-light": "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
        "card-hover": "0 20px 40px -10px rgba(0, 0, 0, 0.3), 0 0 20px rgba(139, 92, 246, 0.1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-scale": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(139, 92, 246, 0.8)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "gradient-shift-animation": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "scale-in": {
          from: { transform: "scale(0)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        orb: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "fade-in-scale": "fade-in-scale 0.4s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "gradient-shift-animation": "gradient-shift-animation 8s ease infinite",
        spin: "spin 1s linear infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        orb: "orb 15s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
