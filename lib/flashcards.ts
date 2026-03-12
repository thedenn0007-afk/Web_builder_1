import type { ColorPalette, FlashcardQuestion, WizardFormData } from "@/types";

export const presetPalettes: Array<{ name: string; primary: string; secondary: string; tertiary: string }> = [
  { name: "Ocean Slate", primary: "#0F766E", secondary: "#E0F2FE", tertiary: "#F97316" },
  { name: "Executive Neutral", primary: "#1F2937", secondary: "#F3F4F6", tertiary: "#C08457" },
  { name: "Luxury Gold", primary: "#111827", secondary: "#F5E6A8", tertiary: "#F9FAFB" },
  { name: "Creative Bloom", primary: "#BE185D", secondary: "#FCE7F3", tertiary: "#7C3AED" },
  { name: "Clean Startup", primary: "#2563EB", secondary: "#DBEAFE", tertiary: "#14B8A6" }
];

const autoPalettesByStyle: Record<string, ColorPalette> = {
  Minimal: { mode: "auto", name: "Minimal Calm", primary: "#1F2937", secondary: "#F8FAFC", tertiary: "#CBD5E1" },
  Modern: { mode: "auto", name: "Modern Signal", primary: "#0F766E", secondary: "#ECFEFF", tertiary: "#F97316" },
  Luxury: { mode: "auto", name: "Luxury Signature", primary: "#111827", secondary: "#F5E6A8", tertiary: "#FFF7ED" },
  Corporate: { mode: "auto", name: "Corporate Trust", primary: "#1D4ED8", secondary: "#EFF6FF", tertiary: "#64748B" },
  Playful: { mode: "auto", name: "Playful Pop", primary: "#EC4899", secondary: "#FDF2F8", tertiary: "#F59E0B" },
  Tech: { mode: "auto", name: "Tech Pulse", primary: "#312E81", secondary: "#E0E7FF", tertiary: "#22C55E" },
  Elegant: { mode: "auto", name: "Elegant Muse", primary: "#4338CA", secondary: "#FAF5FF", tertiary: "#C084FC" },
  Creative: { mode: "auto", name: "Creative Studio", primary: "#7C3AED", secondary: "#F5F3FF", tertiary: "#F97316" }
};

export const imageTags = ["Hero image", "Inspiration", "Layout reference", "Color inspiration", "UI style", "Photography style"];

export const defaultFormValues: WizardFormData = {
  business_name: "",
  business_type: "",
  location: "",
  website_goal: "",
  pages: [],
  features: [],
  design_styles: [],
  color_palette: { mode: "auto", name: "Modern Signal", primary: "#0F766E", secondary: "#ECFEFF", tertiary: "#F97316" },
  target_audience: [],
  services_offered: [],
  customer_location: "",
  customer_location_value: "",
  target_customers: [],
  platform_preference: "",
  business_description: "",
  brand_personality: "",
  tone_of_voice: "",
  unique_selling_points: "",
  business_goals: "",
  brand_assets_available: null,
  inspiration_images: []
};

export const flashcardQuestions: FlashcardQuestion[] = [
  {
    question_id: "business_type",
    question_title: "What type of business is this website for?",
    description: "This helps determine structure, positioning, and recommended platform.",
    recommended: "Pick the closest fit. You can still add a custom answer.",
    options: [
      "Gym",
      "Restaurant",
      "Cafe",
      "Boutique",
      "Salon",
      "Interior Designer",
      "Consulting Business",
      "Personal Brand",
      "Freelancer",
      "Agency",
      "Startup",
      "Software Company",
      "Ecommerce Store",
      "Coaching Business",
      "Education / Course",
      "Healthcare Clinic",
      "Real Estate",
      "Event / Wedding Planner",
      "Construction Company",
      "Travel Agency",
      "Nonprofit",
      "Portfolio Website"
    ],
    allow_custom_input: true,
    customInputLabel: "Other business type"
  },
  {
    question_id: "website_goal",
    question_title: "What is the main goal of the website?",
    description: "The goal shapes the call-to-action flow and page priorities.",
    options: [
      "Generate leads",
      "Sell products online",
      "Get appointment bookings",
      "Show portfolio",
      "Provide business information",
      "Build brand awareness",
      "Capture email subscribers",
      "Community / membership platform",
      "Online course platform",
      "Event promotion"
    ],
    allow_custom_input: true,
    customInputLabel: "Other website goal"
  },
  {
    question_id: "pages",
    question_title: "Which pages should the website include?",
    description: "These define the core structure of the site.",
    options: ["Home", "About", "Services", "Products", "Pricing", "Portfolio", "Gallery", "Testimonials", "FAQ", "Blog", "Contact", "Booking", "Events", "Team", "Careers", "Resources", "Case Studies"],
    allow_custom_input: true,
    multiSelect: true,
    customInputLabel: "Other page"
  },
  {
    question_id: "features",
    question_title: "What functionality should the website have?",
    description: "Choose what visitors need to do on the site.",
    options: ["Contact form", "Booking system", "Online payments", "Newsletter signup", "Live chat", "User login", "Membership area", "Search feature", "Product filtering", "Customer reviews", "Social media integration", "Location map", "File uploads", "Event registration"],
    allow_custom_input: true,
    multiSelect: true,
    customInputLabel: "Other feature"
  },
  {
    question_id: "design_styles",
    question_title: "Which design styles match the brand?",
    description: "You can combine multiple styles for a richer visual direction.",
    options: ["Minimal", "Modern", "Luxury", "Corporate", "Playful", "Tech", "Elegant", "Creative"],
    allow_custom_input: true,
    multiSelect: true,
    customInputLabel: "Other design style"
  },
  {
    question_id: "target_audience",
    question_title: "Who is the broader target audience?",
    description: "This helps shape messaging, trust cues, and conversion strategy.",
    options: ["Individuals", "Families", "Businesses", "Students", "Professionals", "Startups", "Enterprises", "Local customers", "Global customers"],
    allow_custom_input: true,
    multiSelect: true,
    customInputLabel: "Other audience"
  },
  {
    question_id: "services_offered",
    question_title: "What services or products are offered?",
    description: "These will be used to structure page sections and auto-generate SEO opportunities.",
    options: ["Consulting", "Web Development", "Photography", "Real Estate", "Restaurant", "Coaching", "SaaS", "Marketing", "Education"],
    allow_custom_input: true,
    multiSelect: true,
    customInputLabel: "Other service or product"
  },
  {
    question_id: "target_customers",
    question_title: "Who are the primary target customers?",
    description: "This sharpens positioning and content priorities for the final prompt.",
    options: ["Individuals", "Families", "Businesses", "Students", "Professionals", "Startups", "Enterprises", "Non-profits"],
    allow_custom_input: true,
    multiSelect: true,
    customInputLabel: "Other target customer"
  }
];

export function getAutomaticPalette(styles: string[]) {
  const firstKnown = styles.find((style) => autoPalettesByStyle[style]);
  return firstKnown ? autoPalettesByStyle[firstKnown] : autoPalettesByStyle.Modern;
}

export function getRecommendedPlatform(businessType: string, websiteGoal: string) {
  const business = businessType.toLowerCase();
  const goal = websiteGoal.toLowerCase();

  if (business.includes("ecommerce") || goal.includes("sell products")) {
    return "Shopify";
  }

  if (business.includes("portfolio") || business.includes("personal brand") || business.includes("freelancer") || business.includes("agency")) {
    return "Framer";
  }

  if (business.includes("software") || business.includes("startup") || business.includes("saas")) {
    return "Custom Code";
  }

  if (goal.includes("blog") || goal.includes("information")) {
    return "WordPress";
  }

  return "Webflow";
}

export function createPresetPalette(name: string) {
  const preset = presetPalettes.find((item) => item.name === name) || presetPalettes[0];
  return { mode: "preset" as const, ...preset };
}
