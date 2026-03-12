import { signInAction, signUpAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({ mode, error }: { mode: "login" | "signup"; error?: string }) {
  const action = mode === "login" ? signInAction : signUpAction;
  const title = mode === "login" ? "Welcome back" : "Create your account";
  const description = mode === "login" ? "Sign in to continue building and managing website blueprints." : "Start saving website requirement prompts in your personal dashboard.";

  return (
    <Card className="mx-auto w-full max-w-md border-border/70 bg-card/90 shadow-xl shadow-primary/5">
      <CardHeader>
        <CardTitle className="text-3xl">{title}</CardTitle>
        <CardDescription className="text-base leading-7">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Minimum 6 characters" minLength={6} required />
          </div>
          {error ? <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="w-full">{mode === "login" ? "Sign In" : "Create Account"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
