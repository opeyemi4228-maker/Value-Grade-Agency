import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { CopyButton, DeleteEnquiry, NoteForm, NoteItem, StatusPipeline } from "@/components/admin/EnquiryControls";
import { fmtDateTime, fmtHours, timeAgo } from "@/components/admin/format";
import { Avatar, Card, IntentBadge, SampleTag, StatusBadge, btn } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { INTENT_META } from "@/lib/admin/metrics";
import { getEnquiry } from "@/lib/admin/store";

export async function generateMetadata({ params }) {
  const e = await getEnquiry((await params).id);
  return { title: e ? e.company || e.fullName : "Enquiry" };
}

const REPLY_SUBJECT = {
  proposal: "Your VGA proposal request",
  call: "Booking your strategy call with VGA",
  general: "Re: your message to Value Grade Agency",
  creator: "Your VGA creator network application",
};

function Field({ label, children, copy }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-bold tracking-[0.08em] text-forest/45 uppercase">{label}</dt>
      <dd className="mt-1 flex items-center gap-1 text-[13.5px] font-medium break-words text-forest">
        <span className="min-w-0">{children || <span className="text-forest/35">Not given</span>}</span>
        {copy && children && <CopyButton value={copy} label={`Copy ${label.toLowerCase()}`} />}
      </dd>
    </div>
  );
}

export default async function EnquiryPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const e = await getEnquiry(id);
  if (!e) notFound();

  const creator = e.intent === "creator";
  const back = creator ? "/admin/creators" : "/admin/enquiries";
  const digits = e.phone?.replace(/[^\d]/g, "");
  const firstName = e.fullName.split(" ")[0];
  const mailto = `mailto:${e.email}?subject=${encodeURIComponent(REPLY_SUBJECT[e.intent])}&body=${encodeURIComponent(`Hi ${firstName},\n\nThank you for getting in touch with Value Grade Agency.\n\n`)}`;
  const responseHours = e.firstResponseAt ? (new Date(e.firstResponseAt) - new Date(e.createdAt)) / 3_600_000 : null;

  return (
    <>
      <Link href={back} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-forest/55 hover:text-forest">
        <ArrowLeft className="size-4" aria-hidden="true" /> {creator ? "Creator applications" : "Enquiries"}
      </Link>

      <div className="mt-4 flex flex-col gap-5 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={e.fullName} className="size-14 text-base" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[1.55rem] font-extrabold tracking-[-0.03em] text-forest">{e.company || e.fullName}</h1>
              <StatusBadge status={e.status} />
              {e.sample && <SampleTag />}
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-forest/60">
              <IntentBadge intent={e.intent} />
              <span aria-hidden="true">·</span>
              <span>{INTENT_META[e.intent]?.label}</span>
              <span aria-hidden="true">·</span>
              <span title={fmtDateTime(e.createdAt)}>Received {timeAgo(e.createdAt)}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={mailto} className={btn("primary")}>
            <Mail className="size-4" aria-hidden="true" /> Reply by email
          </a>
          {digits && (
            <a href={`tel:+${digits}`} className={btn("secondary")}>
              <Phone className="size-4" aria-hidden="true" /> Call
            </a>
          )}
          {digits && (
            <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer" className={btn("secondary")}>
              <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-4">
          <Card title="Message">
            <blockquote className="rounded-xl border-l-[3px] border-orange bg-cream/60 px-5 py-4 text-[14.5px] leading-relaxed whitespace-pre-wrap text-forest">{e.message}</blockquote>
            {e.contactMethod && (
              <p className="mt-3 text-xs text-forest/55">
                Prefers to be contacted by <span className="font-bold text-forest">{e.contactMethod}</span>.
              </p>
            )}
          </Card>

          <Card title="Details">
            <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Field label="Full name">{e.fullName}</Field>
              <Field label={creator ? "Channel / handle" : "Company"}>{e.company}</Field>
              <Field label="Email" copy={e.email}>
                <a href={`mailto:${e.email}`} className="hover:underline">
                  {e.email}
                </a>
              </Field>
              <Field label="Phone" copy={e.phone}>
                {e.phone}
              </Field>
              <Field label={creator ? "Platform & niche" : "Role"}>{e.role}</Field>
              <Field label="Preferred contact">{e.contactMethod}</Field>
              {!creator && <Field label="Service interest">{e.service}</Field>}
              {!creator && <Field label="Campaign type">{e.campaignType}</Field>}
              {!creator && <Field label="Budget range">{e.budget}</Field>}
            </dl>
          </Card>

          <Card title={`Internal notes${e.notes?.length ? ` (${e.notes.length})` : ""}`}>
            {e.notes?.length > 0 && (
              <ul className="mb-4 space-y-2.5">
                {e.notes.map((n) => (
                  <NoteItem key={n.id} id={e.id} note={n} />
                ))}
              </ul>
            )}
            <NoteForm id={e.id} />
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card title="Pipeline">
            <StatusPipeline id={e.id} status={e.status} />
          </Card>
          <Card title="Record">
            <dl className="space-y-3 text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="text-forest/55">Received</dt>
                <dd className="text-right font-semibold text-forest">{fmtDateTime(e.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-forest/55">First reply</dt>
                <dd className="text-right font-semibold text-forest">{responseHours != null ? `${fmtHours(responseHours)} after` : "Not yet"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-forest/55">Last updated</dt>
                <dd className="text-right font-semibold text-forest">{timeAgo(e.updatedAt)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-forest/55">Email notification</dt>
                <dd className="text-right font-semibold text-forest">{e.emailed ? "Sent" : <span className="text-orange-deep">Failed: check Resend</span>}</dd>
              </div>
            </dl>
            <div className="mt-5 border-t border-line pt-4">
              <DeleteEnquiry id={e.id} backTo={back} />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
