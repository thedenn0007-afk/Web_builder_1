"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { isVerifiedUser } from "@/lib/auth";
import { validatePasswordStrength } from "@/lib/password";
import { generateMasterPrompt } from "@/lib/prompt";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { WizardFormData } from "@/types";
import { buildAbsoluteUrl } from "@/lib/url";

function normalizeArray(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function formatAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Invalid email or password.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Please verify your email before signing in.";
  }

  if (normalized.includes("user already registered")) {
    return "An account already exists for this email. Please sign in instead.";
  }

  return message;
}

async function requireSupabaseForAction() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart the server.");
  }

  return supabase;
}

async function requireVerifiedSession() {
  const supabase = await requireSupabaseForAction();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to continue.");
  }

  if (!isVerifiedUser(user)) {
    throw new Error("Please verify your email address before using the app.");
  }

  return { supabase, user };
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  const strength = validatePasswordStrength(password);
  if (!strength.isValid) {
    redirect(`/signup?error=${encodeURIComponent(strength.errors[0])}&email=${encodeURIComponent(email)}`);
  }

  if (password !== confirmPassword) {
    redirect(`/signup?error=${encodeURIComponent("Passwords do not match.")}&email=${encodeURIComponent(email)}`);
  }

  const supabase = await requireSupabaseForAction();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: buildAbsoluteUrl("/auth/callback?next=/dashboard")
    }
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(formatAuthError(error.message))}&email=${encodeURIComponent(email)}`);
  }

  if (!data.session || !isVerifiedUser(data.user)) {
    await supabase.auth.signOut();
    redirect(`/verify-email?email=${encodeURIComponent(email)}&message=${encodeURIComponent("Check your inbox to verify your account and finish signing in.")}`);
  }

  redirect("/dashboard");
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = await requireSupabaseForAction();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const formattedError = formatAuthError(error.message);
    if (formattedError.toLowerCase().includes("verify your email")) {
      redirect(`/verify-email?email=${encodeURIComponent(email)}&error=${encodeURIComponent(formattedError)}`);
    }

    redirect(`/login?error=${encodeURIComponent(formattedError)}&email=${encodeURIComponent(email)}`);
  }

  if (!isVerifiedUser(data.user)) {
    await supabase.auth.signOut();
    redirect(`/verify-email?email=${encodeURIComponent(email)}&error=${encodeURIComponent("Please verify your email before signing in.")}`);
  }

  redirect("/dashboard");
}

export async function signInWithGoogleAction() {
  const supabase = await requireSupabaseForAction();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: buildAbsoluteUrl("/auth/callback?next=/dashboard")
    }
  });

  if (error || !data.url) {
    redirect(`/login?error=${encodeURIComponent(formatAuthError(error?.message || "Unable to start Google sign-in."))}`);
  }

  redirect(data.url);
}

export async function resendVerificationAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const supabase = await requireSupabaseForAction();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: buildAbsoluteUrl("/auth/callback?next=/dashboard")
    }
  });

  if (error) {
    redirect(`/verify-email?email=${encodeURIComponent(email)}&error=${encodeURIComponent(formatAuthError(error.message))}`);
  }

  redirect(`/verify-email?email=${encodeURIComponent(email)}&message=${encodeURIComponent("A new verification email has been sent.")}`);
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const supabase = await requireSupabaseForAction();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: buildAbsoluteUrl("/auth/callback?next=/reset-password")
  });

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(formatAuthError(error.message))}&email=${encodeURIComponent(email)}`);
  }

  redirect(`/forgot-password?message=${encodeURIComponent("Check your inbox for a password reset link.")}&email=${encodeURIComponent(email)}`);
}

export async function updatePasswordAction(formData: FormData) {
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  const strength = validatePasswordStrength(password);
  if (!strength.isValid) {
    redirect(`/reset-password?error=${encodeURIComponent(strength.errors[0])}`);
  }

  if (password !== confirmPassword) {
    redirect(`/reset-password?error=${encodeURIComponent("Passwords do not match.")}`);
  }

  const supabase = await requireSupabaseForAction();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?error=${encodeURIComponent("Your reset session is missing or expired. Please request a new reset link.")}`);
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(formatAuthError(error.message))}`);
  }

  await supabase.auth.signOut();
  redirect(`/login?message=${encodeURIComponent("Password updated successfully. Please sign in with your new password.")}`);
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}

export async function createProjectAction(payload: WizardFormData) {
  const { supabase, user } = await requireVerifiedSession();

  const cleanPayload = {
    ...payload,
    pages: normalizeArray(payload.pages),
    features: normalizeArray(payload.features),
    design_styles: normalizeArray(payload.design_styles),
    target_audience: normalizeArray(payload.target_audience),
    services_offered: normalizeArray(payload.services_offered),
    target_customers: normalizeArray(payload.target_customers),
    inspiration_images: payload.inspiration_images
      .map((image, index) => ({ ...image, rank: index + 1 }))
      .slice(0, 8),
    platform_preference: payload.preferred_platform,
    generated_prompt: generateMasterPrompt(payload)
  };

  const { data, error } = await supabase
    .from("website_projects")
    .insert({
      user_id: user.id,
      business_name: cleanPayload.business_name,
      business_type: cleanPayload.business_type,
      location: cleanPayload.location,
      website_goal: cleanPayload.website_goal,
      pages: cleanPayload.pages,
      features: cleanPayload.features,
      design_styles: cleanPayload.design_styles,
      color_palette: cleanPayload.color_palette,
      target_audience: cleanPayload.target_audience,
      services_offered: cleanPayload.services_offered,
      customer_location: cleanPayload.customer_location,
      customer_location_value: cleanPayload.customer_location_value,
      target_customers: cleanPayload.target_customers,
      preferred_platform: cleanPayload.preferred_platform,
      business_description: cleanPayload.business_description,
      brand_personality: cleanPayload.brand_personality,
      tone_of_voice: cleanPayload.tone_of_voice,
      unique_selling_points: cleanPayload.unique_selling_points,
      business_goals: cleanPayload.business_goals,
      brand_assets_available: cleanPayload.brand_assets_available,
      inspiration_images: cleanPayload.inspiration_images,
      generated_prompt: cleanPayload.generated_prompt
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/new-project");

  return {
    id: data.id,
    generatedPrompt: cleanPayload.generated_prompt
  };
}

export async function deleteProjectAction(projectId: string) {
  const { supabase } = await requireVerifiedSession();
  const { error } = await supabase.from("website_projects").delete().eq("id", projectId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}