import { ResetPasswordForm } from "@/components/reset-password-form";

export default function ResetPasswordPage({ searchParams }: { searchParams: { error?: string; message?: string } }) {
  return (
    <main className="container py-16">
      <ResetPasswordForm error={searchParams.error} message={searchParams.message} />
    </main>
  );
}