"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useFormStatus } from "react-dom";

import { resendVerificationAction, signInAction, signInWithGoogleAction, signUpAction } from "@/app/actions";
import { passwordRequirements, validatePasswordStrength } from "@/lib/password";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" className="w-full" disabled={pending}>{pending ? "Please wait..." : label}</Button>;
}

function GoogleButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" variant="outline" className="w-full" disabled={pending}>{pending ? "Redirecting..." : "Continue with Google"}</Button>;
}

export function AuthForm({ mode, error, message, email }: { mode: "login" | "signup"; error?: string; message?: string; email?: string }) {
  const action = mode === "login" ? signInAction : signUpAction;
  const title = mode === "login" ? "Welcome back" : "Create your account";
  const description = mode === "login" ? "Sign in with Google or email to continue building and managing website blueprints." : "Create a secure account to save and manage production-ready website blueprints.";
  const [clientError, setClientError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setClientError("");

    if (mode !== "signup") {
      return;
    }

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
        <CardTitle className="text-3xl">{title}</CardTitle>
        <CardDescription className="text-base leading-7">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form action={signInWithGoogleAction}>
          <GoogleButton />
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-3 text-muted-foreground">Or continue with email</span></div>
        </div>

        <form action={action} onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="name@example.com" required defaultValue={email} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder={mode === "signup" ? "Create a strong password" : "Enter your password"} required minLength={10} />
          </div>
          {mode === "signup" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Re-enter your password" required minLength={10} />
              </div>
              <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">Password security requirements</p>
                <ul className="mt-2 space-y-1">
                  {passwordRequirements.map((item) => <li key={item}>- {item}</li>)}
                </ul>
              </div>
            </>
          ) : null}
          {mode === "login" ? <div className="text-right"><Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link></div> : null}
          {message ? <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">{message}</p> : null}
          {error ? <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p> : null}
          {clientError ? <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{clientError}</p> : null}
          <SubmitButton label={mode === "login" ? "Sign In" : "Create Account"} />
        </form>

        {mode === "login" ? (
          <div className="text-sm text-muted-foreground">
            Need to verify your email? <Link href={`/verify-email${email ? `?email=${encodeURIComponent(email)}` : ""}`} className="font-medium text-primary hover:underline">Resend verification</Link>
          </div>
        ) : null}

        <div className="text-xs leading-6 text-muted-foreground">
          By continuing, you agree to our <Link href="/terms" className="font-medium text-primary hover:underline">Terms</Link> and <Link href="/privacy" className="font-medium text-primary hover:underline">Privacy Policy</Link>.
        </div>
      </CardContent>
    </Card>
  );
}

export function ResendVerificationForm({ email, message, error }: { email?: string; message?: string; error?: string }) {
  return (
    <Card className="mx-auto w-full max-w-md border-border/70 bg-card/90 shadow-xl shadow-primary/5">
      <CardHeader>
        <CardTitle className="text-3xl">Verify your email</CardTitle>
        <CardDescription className="text-base leading-7">You need a verified email address before accessing saved projects with email/password sign-in.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form action={resendVerificationAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="verifyEmail">Email</Label>
            <Input id="verifyEmail" name="email" type="email" required placeholder="name@example.com" defaultValue={email} />
          </div>
          {message ? <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">{message}</p> : null}
          {error ? <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p> : null}
          <SubmitButton label="Resend verification email" />
        </form>
        <div className="text-sm text-muted-foreground">
          Already verified? <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </div>
      </CardContent>
    </Card>
  );
}