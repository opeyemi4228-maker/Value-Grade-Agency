import { redirect } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import { adminConfigured, isAdmin } from "@/lib/admin/auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }) {
  if (await isAdmin()) redirect("/admin");
  const { next } = await searchParams;
  const configured = adminConfigured();

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-forest via-forest to-ink p-12 text-soft lg:flex lg:flex-col">
        <div className="grid-lines fade-mask pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative flex items-center gap-3">
          <LogoMark tone="light" className="h-8 w-auto" />
          <span className="text-sm font-extrabold tracking-[0.14em]">VALUE GRADE AGENCY</span>
        </div>
        <div className="relative mt-auto max-w-md">
          <p className="text-[11px] font-bold tracking-[0.2em] text-orange uppercase">Admin workspace</p>
          <h1 className="display mt-4 text-[2.6rem] text-soft">
            Every enquiry, <span className="text-orange">graded</span> and on record.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-soft/65">
            Track proposal requests, strategy calls, creator applications and newsletter sign-ups from the website in one place.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {["Enquiries", "Creators", "Subscribers"].map((label) => (
              <div key={label} className="glass rounded-2xl px-4 py-3">
                <span className="block size-1.5 rounded-full bg-orange" aria-hidden="true" />
                <span className="mt-3 block text-xs font-semibold text-soft/75">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-soft px-5 py-16">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 lg:hidden">
            <LogoMark className="h-7 w-auto" />
            <span className="text-[15px] font-extrabold tracking-[0.08em] text-forest">VGA</span>
            <span className="text-[11px] font-bold tracking-[0.18em] text-orange-deep uppercase">Admin</span>
          </div>
          <h2 className="mt-8 text-2xl font-extrabold tracking-[-0.03em] text-forest lg:mt-0">Sign in</h2>
          <p className="mt-1.5 text-sm text-forest/60">Enter the admin password to continue.</p>

          {configured ? (
            <LoginForm next={typeof next === "string" ? next : ""} />
          ) : (
            <div className="mt-8 rounded-2xl border border-orange/30 bg-orange/[0.06] p-5 text-sm text-forest">
              <p className="font-bold">Admin access isn&apos;t set up yet</p>
              <p className="mt-2 text-forest/70">
                Add <code className="rounded bg-white px-1.5 py-0.5 text-[12px] font-semibold ring-1 ring-line">ADMIN_PASSWORD</code> (and ideally{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-[12px] font-semibold ring-1 ring-line">ADMIN_SESSION_SECRET</code>) to{" "}
                <code className="text-[12px] font-semibold">.env.local</code> or your host&apos;s environment, then restart the server.
              </p>
            </div>
          )}
          <p className="mt-10 text-xs text-forest/45">Restricted area. Access is logged per session.</p>
        </div>
      </div>
    </div>
  );
}
