import type { Metadata } from "next";
import { Inter, Calistoga } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AnimatedBackground } from "@/components/animated-background";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const calistoga = Calistoga({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-calistoga",
});

export const metadata: Metadata = {
  title: "OSS Marketplace - Match Maintainers with Contributors",
  description: "The intelligent matchmaking platform for open source maintainers and contributors. Find perfect matches based on skills, interests, and project needs.",
  keywords: ["open source", "contributors", "maintainers", "GitHub", "matching", "community"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${calistoga.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AnimatedBackground />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
