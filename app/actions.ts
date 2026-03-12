"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateMasterPrompt } from "@/lib/prompt";
import type { WizardFormData } from "@/types";

function normalizeArray(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

async function requireSupabaseForAction() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart the server.");
  }

  return supabase;
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  const supabase = await requireSupabaseForAction();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (!data.session) {
    redirect(`/login?error=${encodeURIComponent("Account created. Check your email confirmation settings, then sign in.")}`);
  }

  redirect("/dashboard");
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  const supabase = await requireSupabaseForAction();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}

export async function createProjectAction(payload: WizardFormData) {
  const supabase = await requireSupabaseForAction();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to save a project.");
  }

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
    preferred_platform: payload.preferred_platform,
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
  const supabase = await requireSupabaseForAction();
  const { error } = await supabase.from("website_projects").delete().eq("id", projectId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}
