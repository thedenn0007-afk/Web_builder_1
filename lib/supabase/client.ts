"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getOptionalClientEnv } from "@/lib/env";

export function createSupabaseBrowserClient() {
  const env = getOptionalClientEnv();

  if (!env) {
    return null;
  }

  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
