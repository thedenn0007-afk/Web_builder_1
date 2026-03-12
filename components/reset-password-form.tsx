"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useFormStatus } from "react-dom";

import { updatePasswordAction } from "@/app/actions";
import { passwordRequirements, validatePasswordStrength } from "@/lib/password";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" className="w-full" disabled={pending}>{pending ? "Updating..." : "Set new password"}</Button>;
}

export function ResetPasswordForm({ error, message }: { error?: string; message?: string }) {
  const [clientError, setClientError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setClientError("");
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    const result = validatePasswordStrength(password);

    if (!result.isValid) {
      event.preventDefault();
      setClientError(result.errors[0]);
      return;
    }

    if (password !== confirmPassword) {
      event.preventDefault();
      setClientError("Passwords do not match.");
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md border-border/70 bg-card/90 shadow-xl shadow-primary/5">
      <CardHeader>
        <CardTitle className="text-3xl">Reset password</CardTitle>
        <CardDescription className="text-base leading-7">Choose a new strong password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={updatePasswordAction} onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="resetPassword">New password</Label>
            <Input id="resetPassword" name="password" type="password" required minLength={10} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resetConfirmPassword">Confirm new password</Label>
            <Input id="resetConfirmPassword" name="confirmPassword" type="password" required minLength={10} />
          </div>
          <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Password security requirements</p>
            <ul className="mt-2 space-y-1">
              {passwordRequirements.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </div>
          {message ? <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">{message}</p> : null}
          {error ? <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p> : null}
          {clientError ? <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{clientError}</p> : null}
          <SubmitButton />
        </form>
        <p className="mt-5 text-sm text-muted-foreground">Need another email? <Link href="/forgot-password" className="font-medium text-primary hover:underline">Request a new reset link</Link>.</p>
      </CardContent>
    </Card>
  );
}