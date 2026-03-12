"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CopyPromptButton({ value }: { value: string }) {
  const [label, setLabel] = useState("Copy prompt");

  return (
    <Button
      type="button"
      variant="outline"
      className="gap-2"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setLabel("Copied");
      }}
    >
      <Copy className="h-4 w-4" />
      {label}
    </Button>
  );
}
