"use client";

import { Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteProjectAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { WebsiteProjectRecord } from "@/types";

interface ProjectCardProps {
  project: WebsiteProjectRecord;
}

function renderChips(values: string[], tone: "primary" | "secondary" = "primary") {
  const classes = tone === "primary" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground";

  if (!values.length) {
    return <span className="text-xs text-muted-foreground">Not specified</span>;
  }

  return values.map((value) => (
    <span key={value} className={`rounded-md px-2 py-1 text-xs ${classes}`}>
      {value}
    </span>
  ));
}

export function ProjectCard({ project }: ProjectCardProps) {
  const handleDelete = async () => {
    try {
      await deleteProjectAction(project.id);
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete project");
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(project.generated_prompt);
      toast.success("Prompt copied to clipboard");
    } catch {
      toast.error("Failed to copy prompt");
    }
  };

  return (
    <Card className="border-border/70 bg-card/90 shadow-lg shadow-primary/5">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{project.business_name}</CardTitle>
            <CardDescription className="mt-1">
              {project.business_type} • {project.customer_location}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyPrompt} className="h-8 w-8 p-0">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium">Description</h4>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {project.business_description || "No description yet."}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium">Target Audience</h4>
            <div className="mt-1 flex flex-wrap gap-1">{renderChips(project.target_audience)}</div>
          </div>

          <div>
            <h4 className="text-sm font-medium">Pages</h4>
            <div className="mt-1 flex flex-wrap gap-1">{renderChips(project.pages)}</div>
          </div>

          <div>
            <h4 className="text-sm font-medium">Features</h4>
            <div className="mt-1 flex flex-wrap gap-1">{renderChips(project.features, "secondary")}</div>
          </div>

          <div>
            <h4 className="text-sm font-medium">Design Styles</h4>
            <div className="mt-1 flex flex-wrap gap-1">{renderChips(project.design_styles, "secondary")}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}