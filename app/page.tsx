import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutTemplate, Sparkles, Wand2 } from "lucide-react";

import { AuthCallout } from "@/components/auth-callout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Flashcard requirement capture",
    description: "Guide non-technical users one card at a time with clear choices, helper tips, and custom answers.",
    icon: LayoutTemplate
  },
  {
    title: "Production-ready prompt engine",
    description: "Turn structured answers into a professional master prompt tailored for strategy, UX, SEO, and delivery.",
    icon: Wand2
  },
  {
    title: "Dashboard with saved blueprints",
    description: "Keep every prompt in one place, copy it instantly, and manage website projects from any device.",
    icon: Sparkles
  }
];

const steps = [
  "Capture business details with one-question flashcards.",
  "Generate a complete website blueprint prompt automatically.",
  "Save, revisit, copy, and refine projects from your dashboard."
];

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="container py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center rounded-full border border-border/80 bg-card/80 px-4 py-1.5 text-sm font-medium shadow-sm backdrop-blur">
                Website strategy, prompt design, and project management in one flow
              </span>
              <div className="space-y-5">
                <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight text-balance sm:text-6xl">
                  Build better website briefs with a polished SaaS workflow.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  Website Blueprint Builder helps founders, agencies, and consultants collect requirements through intuitive flashcards and turn them into a master prompt ready for any AI website builder.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="gap-2 rounded-full px-7">
                  <Link href="/new-project">
                    Start a Blueprint
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-7">
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {steps.map((step) => (
                  <div key={step} className="rounded-2xl border border-border/80 bg-card/70 p-4 shadow-sm backdrop-blur">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium leading-6">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <AuthCallout />
          </div>
        </div>
      </section>

      <section className="container pb-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Core Features</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Built for real SaaS usage, not a demo form.</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-border/70 bg-card/85 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="pt-4 text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-7">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="container pb-24">
        <Card className="overflow-hidden border-none bg-foreground text-background shadow-2xl shadow-foreground/20">
          <CardContent className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-background/70">Ready to Launch</p>
              <h3 className="text-3xl font-bold tracking-tight">Start collecting requirements in a way your clients will actually complete.</h3>
              <p className="max-w-2xl text-background/75">
                Use email auth, Supabase storage, and a Vercel-friendly Next.js stack to ship this as a production SaaS.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-7 text-foreground">
              <Link href="/signup">Create your account</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-border/70 bg-card/60 backdrop-blur">
        <div className="container flex flex-col gap-3 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Website Blueprint Builder</p>
          <p>Next.js 14, Supabase Auth, PostgreSQL, and Vercel-ready deployment.</p>
        </div>
      </footer>
    </main>
  );
}
