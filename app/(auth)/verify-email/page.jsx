import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { VerifyForm } from "@/components/auth/AuthForms";

export const metadata = {
  title: "Confirm your email",
  robots: { index: false, follow: false },
};

// The token is only used when the button is pressed, so email link scanners that pre-open
// links can't use it up.
export default async function VerifyEmailPage({ searchParams }) {
  const { token } = await searchParams;
  const valid = typeof token === "string" && token.length > 20;
  return (
    <AuthShell
      title="Confirm your email"
      intro={valid ? "One click and your account is confirmed." : "This link is incomplete. Log in to send a new one."}
      footer={<Link href="/login" className="font-bold text-forest underline decoration-orange decoration-2 underline-offset-4">Back to log in</Link>}
    >
      {valid && <VerifyForm token={token} />}
    </AuthShell>
  );
}
