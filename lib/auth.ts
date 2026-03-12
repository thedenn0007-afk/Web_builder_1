import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export function getUserProvider(user: User | null) {
  if (!user) {
    return null;
  }

  const identityProvider = user.identities?.[0]?.provider;
  return identityProvider || user.app_metadata?.provider || "email";
}

export function isVerifiedUser(user: User | null) {
  if (!user) {
    return false;
  }

  const provider = getUserProvider(user);
  if (provider && provider !== "email") {
    return true;
  }

  return Boolean(user.email_confirmed_at);
}

export async function getAuthContext() {
  if (!hasSupabaseEnv()) {
    return {
      supabase: null,
      user: null,
      isVerified: false,
      provider: null,
      status: "config-missing" as const
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      supabase: null,
      user: null,
      isVerified: false,
      provider: null,
      status: "config-missing" as const
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      supabase,
      user: null,
      isVerified: false,
      provider: null,
      status: "signed-out" as const
    };
  }

  const provider = getUserProvider(user);
  const verified = isVerifiedUser(user);

  return {
    supabase,
    user,
    isVerified: verified,
    provider,
    status: verified ? ("authenticated" as const) : ("unverified" as const)
  };
}

export async function requireUser() {
  const auth = await getAuthContext();

  if (auth.status === "config-missing") {
    redirect("/login?error=Configure%20Supabase%20environment%20variables%20first.");
  }

  if (auth.status === "signed-out" || !auth.user || !auth.supabase) {
    redirect("/login?error=Please%20sign%20in%20to%20continue.");
  }

  if (!auth.isVerified && auth.user.email) {
    redirect(`/verify-email?email=${encodeURIComponent(auth.user.email)}&error=${encodeURIComponent("Please verify your email before accessing the app.")}`);
  }

  return {
    user: auth.user,
    supabase: auth.supabase
  };
}