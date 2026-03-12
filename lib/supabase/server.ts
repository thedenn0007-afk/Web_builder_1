import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { getOptionalClientEnv } from "@/lib/env";

export async function createSupabaseServerClient() {
  const cookieStore = cookies();
  const env = getOptionalClientEnv();

  if (!env) {
    return null;
  }

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          return;
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          return;
        }
      }
    }
  });
}
