import { ResendVerificationForm } from "@/components/auth-form";

export default function VerifyEmailPage({ searchParams }: { searchParams: { error?: string; message?: string; email?: string } }) {
  return (
    <main className="container py-16">
      <ResendVerificationForm email={searchParams.email} message={searchParams.message} error={searchParams.error} />
    </main>
  );
}