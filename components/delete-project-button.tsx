"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";

import { deleteProjectAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function DeleteProjectButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
      disabled={isPending}
      onClick={() => startTransition(async () => deleteProjectAction(id))}
    >
      <Trash2 className="h-4 w-4" />
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
