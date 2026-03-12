import Link from "next/link";
import { Compass, Layers3, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  "Single-question flashcards keep completion rates high",
  "Supabase-backed accounts and project storage",
  "Instant copy-ready prompts for website builders"
];

export function AuthCallout() {
  return (
    <Card className="border-border/70 bg-card/85 shadow-2xl shadow-primary/10 backdrop-blur">
      <CardContent className="p-8">
        <div className="mb-8 inline-flex rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-primary">
          Launch-ready SaaS stack
        </div>
        <div className="space-y-5">
          <h2 className="text-3xl font-bold tracking-tight">Collect requirements like a strategist, not a spreadsheet.</h2>
          <p className="text-muted-foreground leading-7">
            Create accounts, capture client intent, and save every website blueprint in one responsive experience.
          </p>
        </div>
        <div className="mt-8 grid gap-4">
          {benefits.map((benefit, index) => {
            const Icon = [Compass, Layers3, ShieldCheck][index];
            return (
              <div key={benefit} className="flex items-start gap-4 rounded-2xl border border-border/70 bg-background/70 p-4">
                <div className="mt-1 rounded-xl bg-primary/10 p-2 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium leading-6">{benefit}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="flex-1">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
