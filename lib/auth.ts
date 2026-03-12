import { redirect } from "next/navigation";

import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireUser() {
  if (!hasSupabaseEnv()) {
    redirect("/login?error=Configure%20Supabase%20environment%20variables%20first.");
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login?error=Configure%20Supabase%20environment%20variables%20first.");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { user, supabase };
}
