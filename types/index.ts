export type InspirationImage = {
  id: string;
  name: string;
  tag: string;
  rank: number;
  preview: string;
};

export type ColorPalette = {
  mode: "auto" | "preset" | "custom";
  name: string;
  primary: string;
  secondary: string;
  tertiary: string;
};

export type WebsiteProjectRecord = {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  location: string;
  website_goal: string;
  pages: string[];
  features: string[];
  design_styles: string[];
  color_palette: ColorPalette;
  target_audience: string[];
  services_offered: string[];
  customer_location: string;
  customer_location_value: string;
  target_customers: string[];
  preferred_platform: string;
  business_description: string;
  brand_personality: string;
  tone_of_voice: string;
  unique_selling_points: string;
  business_goals: string;
  brand_assets_available: boolean | null;
  inspiration_images: InspirationImage[];
  generated_prompt: string;
  created_at: string;
};

export type WizardFormData = {
  business_name: string;
  business_type: string;
  location: string;
  website_goal: string;
  pages: string[];
  features: string[];
  design_styles: string[];
  color_palette: ColorPalette;
  target_audience: string[];
  services_offered: string[];
  customer_location: string;
  customer_location_value: string;
  target_customers: string[];
  preferred_platform: string;
  business_description: string;
  brand_personality: string;
  tone_of_voice: string;
  unique_selling_points: string;
  business_goals: string;
  brand_assets_available: boolean | null;
  inspiration_images: InspirationImage[];
};

export type FlashcardQuestion = {
  question_id: keyof WizardFormData | string;
  question_title: string;
  description?: string;
  recommended?: string;
  options: string[];
  allow_custom_input: boolean;
  multiSelect?: boolean;
  customInputLabel?: string;
  helperTips?: string[];
};
