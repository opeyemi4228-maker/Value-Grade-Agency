import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { ResetForm } from "@/components/auth/AuthForms";

export const metadata = {
  title: "Set a new password",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({ searchParams }) {
  const { token } = await searchParams;
  const valid = typeof token === "string" && token.length > 20;
  return (
    <AuthShell
      title="Set a new password"
      intro={valid ? "Choose a new password. You'll be signed out on other devices." : "This link is incomplete. Request a new reset link."}
      footer={<Link href="/forgot-password" className="font-bold text-forest underline decoration-orange decoration-2 underline-offset-4">Request a new link</Link>}
    >
      {valid && <ResetForm token={token} />}
    </AuthShell>
  );
}
