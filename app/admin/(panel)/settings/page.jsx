import { CircleAlert, CircleCheck, Database, LogOut } from "lucide-react";
import { Card, PageHeader, btn } from "@/components/admin/ui";
import { fmtNum } from "@/components/admin/format";
import { requireAdmin } from "@/lib/admin/auth";
import { getDb, storageStatus } from "@/lib/admin/store";
import { clearSample, logout, seedSample } from "../../actions";

export const metadata = { title: "Settings" };

function Row({ ok, title, detail, warn }) {
  const Icon = ok ? CircleCheck : CircleAlert;
  return (
    <li className="flex gap-3 border-t border-line/70 py-3.5 first:border-t-0 first:pt-0">
      <Icon className={ok ? "mt-0.5 size-[18px] shrink-0 text-[#0b6b45]" : warn ? "mt-0.5 size-[18px] shrink-0 text-orange-deep" : "mt-0.5 size-[18px] shrink-0 text-forest/35"} aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[13.5px] font-bold text-forest">
          {title} <span className="sr-only">{ok ? "(configured)" : "(not configured)"}</span>
        </p>
        <p className="mt-0.5 text-[12.5px] break-words text-forest/60">{detail}</p>
      </div>
    </li>
  );
}

const code = (s) => <code className="rounded bg-soft px-1 py-0.5 text-[11.5px] font-semibold text-forest ring-1 ring-line">{s}</code>;

export default async function SettingsPage() {
  await requireAdmin();
  const env = process.env;
  const storage = await storageStatus();
  const db = await getDb();
  const sampleCount = db.enquiries.filter((e) => e.sample).length + db.subscribers.filter((s) => s.sample).length;
  const prod = env.NODE_ENV === "production";

  return (
    <>
      <PageHeader title="Settings" description="Integration status for the website and this admin." />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Integrations">
          <ul>
            <Row
              ok={storage.writable}
              warn
              title="Submission storage"
              detail={storage.writable ? <>Saving to {code(storage.file)}</> : <>Can&apos;t write to {code(storage.file)} ({storage.error}). Check {code("DATABASE_URL")}. Forms still email you.</>}
            />
            <Row
              ok={Boolean(env.RESEND_API_KEY && env.FORMS_TO_EMAIL && env.FORMS_FROM_EMAIL)}
              warn={prod}
              title="Email notifications (Resend)"
              detail={env.RESEND_API_KEY ? <>Sending to {code(env.FORMS_TO_EMAIL || "—")}</> : <>Add {code("RESEND_API_KEY")}, {code("FORMS_TO_EMAIL")} and {code("FORMS_FROM_EMAIL")}.</>}
            />
            <Row ok={Boolean(env.NEXT_PUBLIC_GA_ID)} title="Google Analytics 4" detail={env.NEXT_PUBLIC_GA_ID ? <>Measurement ID {code(env.NEXT_PUBLIC_GA_ID)}. Loads only after cookie consent.</> : <>Set {code("NEXT_PUBLIC_GA_ID")} to enable.</>} />
            <Row ok={Boolean(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY)} title="Spam protection (Turnstile)" detail={env.TURNSTILE_SECRET_KEY ? "Active on all forms, plus honeypot and rate limiting." : "Honeypot and rate limiting are active. Add Turnstile keys for stronger protection."} />
            <Row ok={Boolean(env.NEXT_PUBLIC_BOOKING_URL)} title="Strategy call booking link" detail={env.NEXT_PUBLIC_BOOKING_URL ? <>Opens {code(env.NEXT_PUBLIC_BOOKING_URL)}</> : <>Falls back to the call tab of the contact form. Set {code("NEXT_PUBLIC_BOOKING_URL")} for Calendly or similar.</>} />
          </ul>
        </Card>

        <div className="flex flex-col gap-4">
          <Card title="Admin access">
            <ul>
              <Row ok title="Password sign-in" detail={<>Set by {code("ADMIN_PASSWORD")}. Sessions last 12 hours. Changing the password signs everyone out.</>} />
              <Row ok={Boolean(env.ADMIN_SESSION_SECRET)} warn={prod} title="Session signing secret" detail={env.ADMIN_SESSION_SECRET ? "A dedicated secret is set." : <>Using a key derived from the password. Set {code("ADMIN_SESSION_SECRET")} to a long random string.</>} />
            </ul>
            <form action={logout} className="mt-4">
              <button className={btn("secondary")}>
                <LogOut className="size-4" aria-hidden="true" /> Sign out
              </button>
            </form>
          </Card>

          <Card title="Sample data">
            <div className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-forest/[0.05] text-forest/70">
                <Database className="size-5" aria-hidden="true" />
              </span>
              <p className="text-[13px] text-forest/65">
                Fictional enquiries and subscribers for demos and training, each labelled <strong className="text-forest">Sample</strong>. Real submissions are never touched.{" "}
                {sampleCount > 0 ? `${fmtNum(sampleCount)} sample records are loaded.` : "None loaded."}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <form action={seedSample}>
                <button className={btn("secondary")}>{sampleCount ? "Reload sample data" : "Load sample data"}</button>
              </form>
              {sampleCount > 0 && (
                <form action={clearSample}>
                  <button className={btn("danger")}>Remove sample data</button>
                </form>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
