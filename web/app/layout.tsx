import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
