import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { ForgotForm } from "@/components/auth/AuthForms";

export const metadata = {
  title: "Reset your password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot your password?"
      intro="Enter your email and we'll send you a link to set a new one."
      footer={<Link href="/login" className="font-bold text-forest underline decoration-orange decoration-2 underline-offset-4">Back to log in</Link>}
    >
      <ForgotForm />
    </AuthShell>
  );
}
