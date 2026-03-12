import Link from "next/link";

import { signOutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { getAuthContext } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";

export async function SiteHeader() {
  const supabaseConfigured = hasSupabaseEnv();
  const auth = await getAuthContext();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-extrabold tracking-tight">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">WB</span>
          Website Blueprint Builder
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/">Home</Link>
          <Link href="/new-project">New Project</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-3">
          {!supabaseConfigured ? (
            <span className="hidden rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground sm:inline-flex">
              Add Supabase env vars to enable auth
            </span>
          ) : auth.user ? (
            <>
              {!auth.isVerified && auth.user.email ? <Button asChild variant="ghost"><Link href={`/verify-email?email=${encodeURIComponent(auth.user.email)}`}>Verify Email</Link></Button> : null}
              <form action={signOutAction}>
                <Button type="submit" variant="outline">Sign Out</Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
              <Button asChild><Link href="/signup">Create Account</Link></Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}