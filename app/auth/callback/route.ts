import { NextResponse, type NextRequest } from "next/server";

import { isVerifiedUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildAbsoluteUrl } from "@/lib/url";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const requestedNext = url.searchParams.get("next") || "/dashboard";
  const next = requestedNext.startsWith("/") ? requestedNext : "/dashboard";
  const authError = url.searchParams.get("error_description") || url.searchParams.get("error");

  if (authError) {
    return NextResponse.redirect(buildAbsoluteUrl(`/login?error=${encodeURIComponent(authError)}`));
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(buildAbsoluteUrl("/login?error=Configure%20Supabase%20first."));
  }

  const code = url.searchParams.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(buildAbsoluteUrl(`/login?error=${encodeURIComponent(error.message)}`));
    }
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(buildAbsoluteUrl("/login?error=Authentication%20session%20was%20not%20created."));
  }

  if (next.startsWith("/reset-password")) {
    return NextResponse.redirect(buildAbsoluteUrl("/reset-password?message=Create%20your%20new%20password."));
  }

  if (!isVerifiedUser(user) && user.email) {
    return NextResponse.redirect(buildAbsoluteUrl(`/verify-email?email=${encodeURIComponent(user.email)}&error=${encodeURIComponent("Please verify your email before accessing the app.")}`));
  }

  return NextResponse.redirect(buildAbsoluteUrl(next));
}