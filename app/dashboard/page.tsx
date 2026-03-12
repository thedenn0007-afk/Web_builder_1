import Link from "next/link";

import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { normalizeProjectRecord } from "@/lib/project-normalizer";

export default async function DashboardPage() {
  const { user, supabase } = await requireUser();
  const { data: projects, error } = await supabase
    .from("website_projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const typedProjects = ((projects || []) as Record<string, unknown>[]).map((project) => normalizeProjectRecord(project));

  return (
    <main className="container py-12">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Dashboard</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Your saved website blueprints</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Create, store, copy, and manage prompts generated from structured website discovery cards.</p>
        </div>
        <Button asChild size="lg">
          <Link href="/new-project">Create new blueprint</Link>
        </Button>
      </div>

      {typedProjects.length ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {typedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <Card className="border-border/70 bg-card/90 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>No projects yet</CardTitle>
            <CardDescription>Create your first blueprint to see prompts here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/new-project">Start the flashcard wizard</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}