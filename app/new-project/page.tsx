import Link from "next/link";

import { NewProjectWizard } from "@/components/forms/new-project-wizard";
import { requireUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function NewProjectPage() {
  await requireUser();

  return (
    <main className="container py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">New Project</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Flashcard website requirement collection</h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
      <NewProjectWizard />
    </main>
  );
}
