import type { ColorPalette, WizardFormData } from "@/types";

function formatList(values: string[]) {
  return values.length ? values.join(", ") : "Not specified";
}

function formatPalette(palette: ColorPalette) {
  return `${palette.name} (${palette.mode})\nPrimary: ${palette.primary}\nSecondary: ${palette.secondary}\nTertiary: ${palette.tertiary}`;
}

function formatBrandAssets(value: boolean | null) {
  if (value === null) {
    return "Not specified";
  }

  return value ? "Yes" : "No";
}

function formatInspirationImages(data: WizardFormData) {
  if (!data.inspiration_images.length) {
    return "No inspiration images provided.";
  }

  return data.inspiration_images
    .sort((a, b) => a.rank - b.rank)
    .map((image, index) => `${index + 1}. ${image.name} [Tag: ${image.tag}] [Rank: ${image.rank}]`)
    .join("\n");
}

export function generateMasterPrompt(data: WizardFormData) {
  return `You are an expert web strategist, UX designer, SEO specialist, information architect, conversion copywriter, and full-stack web developer.

Create a complete, developer-ready website blueprint for the business below. The output must be strategic, cleanly structured, detailed, and practical for both business owners and implementation teams.

Use the provided business inputs to infer the best website approach.
Do not ask follow-up questions.
Do not request SEO keywords from the user.
Generate SEO keywords automatically based on the business services, customer location, and target customers.

====================
BUSINESS OVERVIEW
====================
Business Name: ${data.business_name || "Not specified"}
Business Type: ${data.business_type || "Not specified"}
Business Location: ${data.location || "Not specified"}
Business Description: ${data.business_description || "Not specified"}
Primary Business Goals: ${data.business_goals || "Not specified"}
Main Website Goal: ${data.website_goal || "Not specified"}

====================
AUDIENCE & OFFERING
====================
Broader Target Audience: ${formatList(data.target_audience)}
Primary Target Customers: ${formatList(data.target_customers)}
Services or Products Offered: ${formatList(data.services_offered)}
Customer Location Focus: ${data.customer_location || "Not specified"}${data.customer_location_value ? ` - ${data.customer_location_value}` : ""}

====================
WEBSITE STRUCTURE
====================
Required Pages: ${formatList(data.pages)}
Required Features: ${formatList(data.features)}
Preferred Website Platform: ${data.platform_preference || "Not specified"}

====================
BRAND & DESIGN
====================
Design Styles: ${formatList(data.design_styles)}
Color Palette Direction:
${formatPalette(data.color_palette)}
Brand Personality: ${data.brand_personality || "Not specified"}
Tone of Voice: ${data.tone_of_voice || "Not specified"}
Unique Selling Points: ${data.unique_selling_points || "Not specified"}
Brand Assets Available: ${formatBrandAssets(data.brand_assets_available)}

====================
INSPIRATION REFERENCES
====================
${formatInspirationImages(data)}

====================
OUTPUT REQUIREMENTS
====================
Provide the response in the following exact sections:

1. Executive Summary
Summarize the business, audience, website objective, and overall digital direction.

2. Recommended Website Strategy
Explain the recommended website approach, conversion flow, and positioning strategy.

3. Recommended Platform Decision
Explain why the chosen platform is the best fit and mention tradeoffs of alternatives when relevant.

4. Information Architecture
List each recommended page and describe its role.

5. Page-by-Page Content Blueprint
For every key page, describe sections, content blocks, CTA ideas, and trust-building elements.

6. Feature Implementation Plan
Explain how each requested feature should work from a user and business perspective.

7. UX / UI Direction
Describe navigation structure, visual hierarchy, mobile behavior, and interaction patterns.

8. Visual Design System
Recommend typography, layout style, spacing, color usage, and component tone based on the selected design styles and palette.

9. SEO Strategy
Automatically generate smart SEO keyword targets based on the services/products, customer location, and target customers.
Include primary keywords, secondary keywords, local SEO opportunities, sample page titles, and meta description ideas.

10. Conversion Recommendations
Suggest lead generation, trust signals, CTA placement, and funnel improvements.

11. Technical Implementation Outline
Recommend the development stack, CMS approach if relevant, integrations, and data handling considerations.

12. Launch Plan
Explain the steps required to prepare, test, and deploy the website.

13. Future Enhancements
Suggest practical improvements for future scaling.

Formatting requirements:
- Keep the response clean and readable.
- Use clear headings and subheadings.
- Be specific and practical.
- Avoid vague filler text.
- Make the blueprint directly usable by a designer, strategist, and developer.`;
}
