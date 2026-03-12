import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Project not found</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        The requested page does not exist or you do not have access to it.
      </p>
      <Button asChild className="mt-8">
        <Link href="/dashboard">Return to dashboard</Link>
      </Button>
    </main>
  );
}
