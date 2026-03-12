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

export const metadata: Metadata = {
  title: "Website Blueprint Builder",
  description: "Generate professional website planning prompts with a guided SaaS workflow."
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
