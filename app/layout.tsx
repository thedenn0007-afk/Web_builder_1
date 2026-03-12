import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  metadataBase: appUrl ? new URL(appUrl) : undefined,
  title: {
    default: "Website Blueprint Builder",
    template: "%s | Website Blueprint Builder"
  },
  description: "Generate structured website blueprints with secure auth, guided discovery, and AI-ready planning prompts.",
  openGraph: {
    title: "Website Blueprint Builder",
    description: "A production-ready SaaS for collecting website requirements and generating AI-ready master prompts.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Blueprint Builder",
    description: "A production-ready SaaS for collecting website requirements and generating AI-ready master prompts."
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(manrope.variable, "min-h-screen font-sans")}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}