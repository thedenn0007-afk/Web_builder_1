import Link from "next/link";

import { requestPasswordResetAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage({ searchParams }: { searchParams: { error?: string; message?: string; email?: string } }) {
  return (
    <main className="container py-16">
      <Card className="mx-auto w-full max-w-md border-border/70 bg-card/90 shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-3xl">Forgot password</CardTitle>
          <CardDescription className="text-base leading-7">Enter your email and we’ll send you a secure reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={requestPasswordResetAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="forgotEmail">Email</Label>
              <Input id="forgotEmail" name="email" type="email" required defaultValue={searchParams.email} placeholder="name@example.com" />
            </div>
            {searchParams.message ? <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">{searchParams.message}</p> : null}
            {searchParams.error ? <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{searchParams.error}</p> : null}
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
          <p className="mt-5 text-sm text-muted-foreground">Remembered your password? <Link href="/login" className="font-medium text-primary hover:underline">Back to login</Link>.</p>
        </CardContent>
      </Card>
    </main>
  );
}