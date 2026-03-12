import { createClient } from "@supabase/supabase-js";

import { getOptionalServerEnv } from "@/lib/env";

export function createSupabaseAdminClient() {
  const env = getOptionalServerEnv();

  if (!env || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase admin configuration is incomplete. Check NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
