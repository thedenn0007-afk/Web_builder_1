import { AuthForm } from "@/components/auth-form";

export default function SignupPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="container py-16">
      <AuthForm mode="signup" error={searchParams.error} />
    </main>
  );
}
