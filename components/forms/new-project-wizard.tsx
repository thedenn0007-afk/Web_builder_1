"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, CheckCircle2, ChevronLeft, ChevronRight, Copy, ImagePlus, Loader2, Sparkles, Trash2 } from "lucide-react";

import { createProjectAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { createPresetPalette, defaultFormValues, flashcardQuestions, getAutomaticPalette, getRecommendedPlatform, imageTags, presetPalettes } from "@/lib/flashcards";
import type { InspirationImage, WizardFormData } from "@/types";

const platformOptions = ["Webflow", "WordPress", "Framer", "Shopify", "Custom Code"];
const customerLocationOptions = ["Local area", "City", "State", "Country", "Global"];

const stepTitles = [
  "Business basics",
  ...flashcardQuestions.map((question) => question.question_title),
  "Color palette",
  "Customer location",
  "Preferred website platform",
  "Business description",
  "Brand personality",
  "Tone of voice",
  "Unique selling points",
  "Business goals",
  "Brand assets available",
  "Inspiration gallery"
];

const totalSteps = stepTitles.length;

function parseCustomEntries(input: string) {
  return input
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function formatPaletteSummary(formData: WizardFormData) {
  const palette = formData.color_palette;
  return `${palette.name} - ${palette.primary} / ${palette.secondary} / ${palette.tertiary}`;
}

export function NewProjectWizard() {
  const [formData, setFormData] = useState<WizardFormData>(defaultFormValues);
  const [stepIndex, setStepIndex] = useState(0);
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy prompt");

  const progress = useMemo(() => ((stepIndex + 1) / totalSteps) * 100, [stepIndex]);
  const recommendedPlatform = useMemo(
    () => getRecommendedPlatform(formData.business_type, formData.website_goal),
    [formData.business_type, formData.website_goal]
  );

  useEffect(() => {
    if (!formData.preferred_platform) {
      setFormData((current) => ({ ...current, preferred_platform: recommendedPlatform }));
    }
  }, [recommendedPlatform, formData.preferred_platform]);

  useEffect(() => {
    if (formData.color_palette.mode === "auto") {
      setFormData((current) => ({ ...current, color_palette: getAutomaticPalette(current.design_styles) }));
    }
  }, [formData.design_styles, formData.color_palette.mode]);

  function updateField<K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  function toggleArrayValue(key: "pages" | "features" | "design_styles" | "target_audience" | "services_offered" | "target_customers", value: string) {
    setFormData((current) => {
      const currentValues = current[key];
      const exists = currentValues.includes(value);

      return {
        ...current,
        [key]: exists ? currentValues.filter((item) => item !== value) : [...currentValues, value]
      };
    });
  }

  function setSingleValue(key: keyof WizardFormData, value: string) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  function addCustomValue(key: keyof WizardFormData, questionId: string) {
    const value = customInputs[questionId] || "";
    const entries = parseCustomEntries(value);

    if (!entries.length) {
      setError("Enter a custom answer before adding it.");
      return;
    }

    setError("");

    setFormData((current) => {
      const target = current[key];

      if (Array.isArray(target)) {
        return {
          ...current,
          [key]: Array.from(new Set([...target, ...entries]))
        };
      }

      return {
        ...current,
        [key]: entries.join(", ")
      };
    });

    setCustomInputs((current) => ({ ...current, [questionId]: "" }));
  }

  function removeChip(key: keyof WizardFormData, value: string) {
    const target = formData[key];
    if (!Array.isArray(target)) {
      return;
    }

    updateField(key as never, target.filter((item) => item !== value) as never);
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    const nextImages: InspirationImage[] = [];

    for (const file of Array.from(files).slice(0, 8)) {
      const preview = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Unable to read image."));
        reader.readAsDataURL(file);
      });

      nextImages.push({
        id: `${file.name}-${crypto.randomUUID()}`,
        name: file.name,
        tag: "Inspiration",
        rank: formData.inspiration_images.length + nextImages.length + 1,
        preview
      });
    }

    setFormData((current) => ({
      ...current,
      inspiration_images: [...current.inspiration_images, ...nextImages].slice(0, 8).map((image, index) => ({ ...image, rank: index + 1 }))
    }));
  }

  function updateImage(id: string, updates: Partial<InspirationImage>) {
    setFormData((current) => ({
      ...current,
      inspiration_images: current.inspiration_images.map((image) => (image.id === id ? { ...image, ...updates } : image))
    }));
  }

  function moveImage(id: string, direction: "up" | "down") {
    setFormData((current) => {
      const images = [...current.inspiration_images];
      const index = images.findIndex((image) => image.id === id);
      const swapIndex = direction === "up" ? index - 1 : index + 1;

      if (index < 0 || swapIndex < 0 || swapIndex >= images.length) {
        return current;
      }

      [images[index], images[swapIndex]] = [images[swapIndex], images[index]];
      return {
        ...current,
        inspiration_images: images.map((image, itemIndex) => ({ ...image, rank: itemIndex + 1 }))
      };
    });
  }

  function removeImage(id: string) {
    setFormData((current) => ({
      ...current,
      inspiration_images: current.inspiration_images.filter((image) => image.id !== id).map((image, index) => ({ ...image, rank: index + 1 }))
    }));
  }

  function validateCurrentStep() {
    if (stepIndex === 0) {
      return Boolean(formData.business_name && formData.location);
    }

    if (stepIndex >= 1 && stepIndex <= 8) {
      const question = flashcardQuestions[stepIndex - 1];
      const value = formData[question.question_id as keyof WizardFormData];
      return Array.isArray(value) ? value.length > 0 : Boolean(value);
    }

    if (stepIndex === 9) {
      return Boolean(formData.color_palette.name);
    }

    if (stepIndex === 10) {
      return Boolean(formData.customer_location && (formData.customer_location !== "City" || formData.customer_location_value));
    }

    if (stepIndex === 11) {
      return Boolean(formData.preferred_platform || recommendedPlatform);
    }

    if (stepIndex === 12) {
      return Boolean(formData.business_description);
    }

    if (stepIndex === 13) {
      return Boolean(formData.brand_personality);
    }

    if (stepIndex === 14) {
      return Boolean(formData.tone_of_voice);
    }

    if (stepIndex === 15) {
      return Boolean(formData.unique_selling_points);
    }

    if (stepIndex === 16) {
      return Boolean(formData.business_goals);
    }

    if (stepIndex === 17) {
      return formData.brand_assets_available !== null;
    }

    return true;
  }

  function goNext() {
    if (!validateCurrentStep()) {
      setError("Please complete this card before moving forward.");
      return;
    }

    setError("");
    setStepIndex((current) => Math.min(current + 1, totalSteps - 1));
  }

  function goPrevious() {
    setError("");
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function submitProject() {
    if (!validateCurrentStep()) {
      setError("Please complete the current card before generating the prompt.");
      return;
    }

    setError("");
    startTransition(async () => {
      try {
        const result = await createProjectAction({
          ...formData,
          preferred_platform: formData.preferred_platform || recommendedPlatform
        });
        setGeneratedPrompt(result.generatedPrompt);
        setCopyLabel("Copy prompt");
      } catch (submissionError) {
        setError(submissionError instanceof Error ? submissionError.message : "Unable to save project.");
      }
    });
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopyLabel("Copied");
  }

  const currentQuestion = stepIndex >= 1 && stepIndex <= 8 ? flashcardQuestions[stepIndex - 1] : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
      <Card className="border-border/70 bg-card/85 shadow-xl shadow-primary/5">
        <CardHeader>
          <Badge className="w-fit">Flashcard wizard</Badge>
          <CardTitle className="text-3xl">Create a new website blueprint</CardTitle>
          <CardDescription className="text-base leading-7">
            One focused card at a time, with custom answers, visual choices, and a cleaner final prompt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{stepIndex + 1} / {totalSteps}</span>
            </div>
            <Progress value={progress} />
          </div>
          <div className="rounded-2xl bg-secondary/70 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Current card</p>
            <p className="mt-2 text-lg font-semibold leading-7">{stepTitles[stepIndex]}</p>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Live summary</p>
            <p>{formData.business_name || "Unnamed project"} - {formData.business_type || "Business type pending"}</p>
            <p>{formData.design_styles.length ? formData.design_styles.join(", ") : "Design styles pending"}</p>
            <p>{formatPaletteSummary(formData)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-border/70 bg-card/90 shadow-2xl shadow-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">{stepTitles[stepIndex]}</CardTitle>
            <CardDescription className="text-base leading-7">
              {stepIndex === 0 && "Start with the fundamentals so the rest of the wizard can recommend the right direction."}
              {currentQuestion?.description}
              {stepIndex === 9 && "Choose automatic, preset, or fully custom colors with a visual picker."}
              {stepIndex === 10 && "Location helps the prompt infer local SEO and geographic messaging."}
              {stepIndex >= 12 && stepIndex <= 16 && "These one-at-a-time details make the final master prompt cleaner and more useful."}
              {stepIndex === 17 && "For now we only collect whether assets exist. No uploads in this section yet."}
              {stepIndex === 18 && "Upload inspiration images, rank them, and tag them so the AI can understand the visual direction."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {stepIndex === 0 ? (
              <div className="grid gap-4">
                <Input placeholder="Business name" value={formData.business_name} onChange={(event) => updateField("business_name", event.target.value)} />
                <Input placeholder="Business location" value={formData.location} onChange={(event) => updateField("location", event.target.value)} />
              </div>
            ) : null}

            {currentQuestion ? (
              <div className="space-y-5">
                {currentQuestion.recommended ? (
                  <div className="rounded-2xl border border-border/70 bg-secondary/60 p-4 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Recommended:</span> {currentQuestion.recommended}
                  </div>
                ) : null}
                <div className="grid gap-3 sm:grid-cols-2">
                  {currentQuestion.options.map((option) => {
                    const field = currentQuestion.question_id as keyof WizardFormData;
                    const value = formData[field];
                    const checked = Array.isArray(value) ? value.includes(option) : value === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          if (currentQuestion.multiSelect) {
                            toggleArrayValue(field as "pages" | "features" | "design_styles" | "target_audience" | "services_offered" | "target_customers", option);
                          } else {
                            setSingleValue(field, option);
                          }
                        }}
                        className={`rounded-2xl border p-4 text-left transition ${checked ? "border-primary bg-primary/10 shadow-lg shadow-primary/10" : "border-border bg-background hover:border-primary/50 hover:bg-secondary/30"}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-semibold">{option}</p>
                          {currentQuestion.multiSelect ? <Checkbox checked={checked} className="pointer-events-none" /> : checked ? <CheckCircle2 className="h-5 w-5 text-primary" /> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {Array.isArray(formData[currentQuestion.question_id as keyof WizardFormData]) ? (
                  <div className="flex flex-wrap gap-2">
                    {(formData[currentQuestion.question_id as keyof WizardFormData] as string[]).map((item) => (
                      <button key={item} x
                        {item} x
                      </button>
                    ))}
                  </div>
                ) : typeof formData[currentQuestion.question_id as keyof WizardFormData] === "string" && formData[currentQuestion.question_id as keyof WizardFormData] ? (
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-foreground">
                      Selected: {formData[currentQuestion.question_id as keyof WizardFormData] as string}
                    </span>
                  </div>
                ) : null}
                {currentQuestion.allow_custom_input ? (
                  <div className="rounded-2xl border border-dashed border-border bg-background/70 p-4">
                    <p className="mb-3 text-sm font-semibold">{currentQuestion.customInputLabel || "Other"}</p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        value={customInputs[currentQuestion.question_id] || ""}
                        onChange={(event) => setCustomInputs((current) => ({ ...current, [currentQuestion.question_id]: event.target.value }))}
                        placeholder="Add your custom answer"
                      />
                      <Button type="button" variant="secondary" onClick={() => addCustomValue(currentQuestion.question_id as keyof WizardFormData, currentQuestion.question_id)}>
                        Add custom
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {stepIndex === 9 ? (
              <div className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { key: "auto", label: "Auto palette" },
                    { key: "preset", label: "Preset combos" },
                    { key: "custom", label: "Custom picker" }
                  ].map((mode) => (
                    <button
                      key={mode.key}
                      type="button"
                      onClick={() => {
                        if (mode.key === "auto") {
                          updateField("color_palette", getAutomaticPalette(formData.design_styles));
                          return;
                        }

                        if (mode.key === "preset") {
                          updateField("color_palette", createPresetPalette(presetPalettes[0].name));
                          return;
                        }

                        updateField("color_palette", { ...formData.color_palette, mode: "custom", name: "Custom Palette" });
                      }}
                      className={`rounded-2xl border p-4 text-left ${formData.color_palette.mode === mode.key ? "border-primary bg-primary/10" : "border-border bg-background"}`}
                    >
                      <p className="font-semibold">{mode.label}</p>
                    </button>
                  ))}
                </div>

                {formData.color_palette.mode === "auto" ? (
                  <div className="rounded-2xl border border-border bg-secondary/40 p-5">
                    <p className="font-semibold">Automatically generated from selected design styles</p>
                    <p className="mt-2 text-sm text-muted-foreground">{formatPaletteSummary(formData)}</p>
                  </div>
                ) : null}

                {formData.color_palette.mode === "preset" ? (
                  <div className="grid gap-3">
                    {presetPalettes.map((palette) => (
                      <button key={palette.name} type="button" onClick={() => updateField("color_palette", createPresetPalette(palette.name))} className={`rounded-2xl border p-4 text-left ${formData.color_palette.name === palette.name ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold">{palette.name}</p>
                            <p className="text-sm text-muted-foreground">{palette.primary} - {palette.secondary} - {palette.tertiary}</p>
                          </div>
                          <div className="flex gap-2">
                            {[palette.primary, palette.secondary, palette.tertiary].map((color) => <span key={color} className="h-8 w-8 rounded-full border" style={{ backgroundColor: color }} />)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}

                {formData.color_palette.mode === "custom" ? (
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { key: "primary", label: "Primary color" },
                      { key: "secondary", label: "Secondary color" },
                      { key: "tertiary", label: "Tertiary color" }
                    ].map((item) => (
                      <label key={item.key} className="rounded-2xl border border-border bg-background p-4">
                        <p className="mb-3 font-semibold">{item.label}</p>
                        <input
                          type="color"
                          value={formData.color_palette[item.key as keyof typeof formData.color_palette] as string}
                          onChange={(event) => updateField("color_palette", { ...formData.color_palette, mode: "custom", name: "Custom Palette", [item.key]: event.target.value })}
                          className="h-14 w-full cursor-pointer rounded-xl border border-border bg-transparent"
                        />
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            {stepIndex === 10 ? (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {customerLocationOptions.map((option) => {
                    const checked = formData.customer_location === option;
                    return (
                      <button key={option} type="button" onClick={() => updateField("customer_location", option)} className={`rounded-2xl border p-4 text-left ${checked ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
                        <div className="flex items-start justify-between">
                          <p className="font-semibold">{option}</p>
                          {checked ? <CheckCircle2 className="h-5 w-5 text-primary" /> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {formData.customer_location === "City" ? <Input placeholder="Enter city name" value={formData.customer_location_value} onChange={(event) => updateField("customer_location_value", event.target.value)} /> : null}
              </div>
            ) : null}

            {stepIndex === 11 ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm text-foreground">
                  Recommended platform: <span className="font-semibold">{recommendedPlatform}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {platformOptions.map((platform) => {
                    const checked = (formData.preferred_platform || recommendedPlatform) === platform;
                    return (
                      <button key={platform} type="button" onClick={() => updateField("preferred_platform", platform)} className={`rounded-2xl border p-4 text-left ${checked ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
                        <div className="flex items-start justify-between">
                          <p className="font-semibold">{platform}</p>
                          {checked ? <CheckCircle2 className="h-5 w-5 text-primary" /> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {stepIndex === 12 ? <Textarea placeholder="Describe the business clearly in 2-4 sentences." value={formData.business_description} onChange={(event) => updateField("business_description", event.target.value)} /> : null}
            {stepIndex === 13 ? <Textarea placeholder="Examples: trustworthy, premium, approachable, bold, innovative." value={formData.brand_personality} onChange={(event) => updateField("brand_personality", event.target.value)} /> : null}
            {stepIndex === 14 ? <Textarea placeholder="Examples: professional, friendly, persuasive, expert-led, conversational." value={formData.tone_of_voice} onChange={(event) => updateField("tone_of_voice", event.target.value)} /> : null}
            {stepIndex === 15 ? <Textarea placeholder="List the main differentiators, benefits, or reasons customers choose this business." value={formData.unique_selling_points} onChange={(event) => updateField("unique_selling_points", event.target.value)} /> : null}
            {stepIndex === 16 ? <Textarea placeholder="Describe the broader business goals this website should support." value={formData.business_goals} onChange={(event) => updateField("business_goals", event.target.value)} /> : null}

            {stepIndex === 17 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {[{ label: "Yes", value: true }, { label: "No", value: false }].map((option) => (
                  <button key={option.label} type="button" onClick={() => updateField("brand_assets_available", option.value)} className={`rounded-2xl border p-4 text-left ${formData.brand_assets_available === option.value ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
                    <div className="flex items-start justify-between">
                      <p className="font-semibold">{option.label}</p>
                      {formData.brand_assets_available === option.value ? <CheckCircle2 className="h-5 w-5 text-primary" /> : null}
                    </div>
                  </button>
                ))}
              </div>
            ) : null}

            {stepIndex === 18 ? (
              <div className="space-y-5">
                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-background/70 p-6 text-center">
                  <ImagePlus className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Upload inspiration images</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(event) => void handleImageUpload(event.target.files)} />
                </label>
                <div className="space-y-4">
                  {formData.inspiration_images.map((image, index) => (
                    <div key={image.id} className="grid gap-4 rounded-2xl border border-border bg-background p-4 md:grid-cols-[96px_1fr_auto] md:items-center">
                      <div className="relative h-24 w-24 overflow-hidden rounded-xl"><Image src={image.preview} alt={image.name} fill sizes="96px" className="object-cover" unoptimized /></div>
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold">{image.name}</p>
                          <p className="text-sm text-muted-foreground">Rank #{index + 1}</p>
                        </div>
                        <select value={image.tag} onChange={(event) => updateImage(image.id, { tag: event.target.value })} className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm">
                          {imageTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
                        </select>
                      </div>
                      <div className="flex gap-2 md:flex-col">
                        <Button type="button" variant="outline" size="icon" onClick={() => moveImage(image.id, "up")} disabled={index === 0}><ArrowUp className="h-4 w-4" /></Button>
                        <Button type="button" variant="outline" size="icon" onClick={() => moveImage(image.id, "down")} disabled={index === formData.inspiration_images.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                        <Button type="button" variant="outline" size="icon" onClick={() => removeImage(image.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {error ? <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button type="button" variant="outline" onClick={goPrevious} disabled={stepIndex === 0 || isPending} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              {stepIndex === totalSteps - 1 ? (
                <Button type="button" onClick={submitProject} disabled={isPending} className="gap-2">
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Generate master prompt
                </Button>
              ) : (
                <Button type="button" onClick={goNext} disabled={isPending} className="gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-foreground text-background shadow-2xl shadow-foreground/15">
          <CardHeader>
            <CardTitle className="text-2xl">Generated master prompt</CardTitle>
            <CardDescription className="text-background/70">The final prompt is now cleaner, more detailed, and structured for direct AI use.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl bg-background/10 p-4 text-sm leading-7 text-background/90">
              {generatedPrompt || "Complete the wizard to generate and save the prompt."}
            </pre>
            <Button type="button" variant="secondary" onClick={copyPrompt} disabled={!generatedPrompt} className="gap-2 text-foreground">
              <Copy className="h-4 w-4" />
              {copyLabel}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

