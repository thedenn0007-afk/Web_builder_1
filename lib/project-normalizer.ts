import type { ColorPalette, InspirationImage, WebsiteProjectRecord } from "@/types";

function toStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function toColorPalette(value: unknown): ColorPalette {
  if (value && typeof value === "object") {
    const palette = value as Partial<ColorPalette>;
    return {
      mode: palette.mode === "preset" || palette.mode === "custom" ? palette.mode : "auto",
      name: palette.name || "Modern Signal",
      primary: palette.primary || "#0F766E",
      secondary: palette.secondary || "#ECFEFF",
      tertiary: palette.tertiary || "#F97316"
    };
  }

  return {
    mode: "auto",
    name: "Modern Signal",
    primary: "#0F766E",
    secondary: "#ECFEFF",
    tertiary: "#F97316"
  };
}

function toInspirationImages(value: unknown): InspirationImage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item, index) => {
    const image = (item || {}) as Partial<InspirationImage>;
    return {
      id: image.id || `image-${index + 1}`,
      name: image.name || `Image ${index + 1}`,
      tag: image.tag || "Inspiration",
      rank: typeof image.rank === "number" ? image.rank : index + 1,
      preview: image.preview || ""
    };
  });
}

export function normalizeProjectRecord(project: Record<string, unknown>): WebsiteProjectRecord {
  return {
    id: String(project.id || ""),
    user_id: String(project.user_id || ""),
    business_name: String(project.business_name || "Untitled Project"),
    business_type: String(project.business_type || "Not specified"),
    location: String(project.location || ""),
    website_goal: String(project.website_goal || "Not specified"),
    pages: toStringArray(project.pages),
    features: toStringArray(project.features),
    design_styles: toStringArray(project.design_styles ?? project.design_style),
    color_palette: toColorPalette(project.color_palette),
    target_audience: toStringArray(project.target_audience),
    services_offered: toStringArray(project.services_offered),
    customer_location: String(project.customer_location || project.location || "Not specified"),
    customer_location_value: String(project.customer_location_value || ""),
    target_customers: toStringArray(project.target_customers),
    platform_preference: String(project.platform_preference || project.preferred_platform || "Not specified"),
    business_description: String(project.business_description || ""),
    brand_personality: String(project.brand_personality || ""),
    tone_of_voice: String(project.tone_of_voice || ""),
    unique_selling_points: String(project.unique_selling_points || ""),
    business_goals: String(project.business_goals || ""),
    brand_assets_available: typeof project.brand_assets_available === "boolean" ? project.brand_assets_available : null,
    inspiration_images: toInspirationImages(project.inspiration_images),
    generated_prompt: String(project.generated_prompt || ""),
    created_at: String(project.created_at || "")
  };
}