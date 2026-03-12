import { AuthForm } from "@/components/auth-form";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="container py-16">
      <AuthForm mode="login" error={searchParams.error} />
    </main>
  );
}
