import { AuthForm } from "@/components/auth-form";

export default function SignupPage({ searchParams }: { searchParams: { error?: string; message?: string; email?: string } }) {
  return (
    <main className="container py-16">
      <AuthForm mode="signup" error={searchParams.error} message={searchParams.message} email={searchParams.email} />
    </main>
  );
}