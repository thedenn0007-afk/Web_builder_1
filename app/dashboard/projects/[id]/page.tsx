import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyPromptButton } from "@/components/copy-prompt-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { normalizeProjectRecord } from "@/lib/project-normalizer";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { user, supabase } = await requireUser();
  const { data: project, error } = await supabase
    .from("website_projects")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !project) {
    notFound();
  }

  const record = normalizeProjectRecord(project as Record<string, unknown>);

  return (
    <main className="container py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Project Details</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">{record.business_name}</h1>
        </div>
        <div className="flex gap-3">
          <CopyPromptButton value={record.generated_prompt} />
          <Button asChild variant="outline">
            <Link href="/dashboard">Back</Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <Card className="border-border/70 bg-card/90">
          <CardHeader>
            <CardTitle>Project snapshot</CardTitle>
            <CardDescription>Saved data used to generate the final master prompt.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 text-sm leading-7">
            <div>
              <p className="font-semibold">Target audience</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {record.target_audience.map((item) => (
                  <Badge key={item} variant="outline">{item}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold">Design styles</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {record.design_styles.map((item) => (
                  <Badge key={item} variant="outline">{item}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold">Target customers</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {record.target_customers.map((item) => (
                  <Badge key={item} variant="secondary">{item}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold">Services offered</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {record.services_offered.map((item) => (
                  <Badge key={item} variant="outline">{item}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold">Color palette</p>
              <p className="text-muted-foreground">{record.color_palette.name} · {record.color_palette.primary} / {record.color_palette.secondary} / {record.color_palette.tertiary}</p>
            </div>
            <div>
              <p className="font-semibold">Preferred platform</p>
              <p className="text-muted-foreground">{record.platform_preference}</p>
            </div>
            <div>
              <p className="font-semibold">Brand assets available</p>
              <p className="text-muted-foreground">{record.brand_assets_available === null ? "Not specified" : record.brand_assets_available ? "Yes" : "No"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-foreground text-background shadow-xl shadow-foreground/10">
          <CardHeader>
            <CardTitle>Master prompt</CardTitle>
            <CardDescription className="text-background/70">Copy this prompt into your preferred AI website builder or planning assistant.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="max-h-[760px] overflow-auto whitespace-pre-wrap rounded-2xl bg-background/10 p-5 text-sm leading-7 text-background/90">
              {record.generated_prompt}
            </pre>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}