import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import LocalTime from "@/components/LocalTime";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Contact VGA & Book a Strategy Call",
  description:
    "Request a proposal, book a strategy call or contact Value Grade Agency about creator, influencer and performance-partner campaigns.",
  path: "/contact",
});

const channels = [
  { icon: MessageCircle, label: "WhatsApp", value: "Chat with the team", href: site.whatsapp, external: true },
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: Phone, label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
];

export default async function ContactPage({ searchParams }) {
  const { intent, email } = await searchParams;

  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-40 text-forest sm:pt-48 sm:pb-48">
        <div className="grid-lines-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_15%_30%,black,transparent_75%)]" aria-hidden="true" />
        
        <div className="relative grid grid-cols-1 gap-12 gutter lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <Reveal>
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] font-medium text-forest/50">
                <Link href="/" className="transition-colors hover:text-forest">Home</Link>
                <ChevronRight className="size-3" aria-hidden="true" />
                <span className="text-forest/80" aria-current="page">Contact</span>
              </nav>
            </Reveal>
            <Reveal delay={0.06}>
              <Eyebrow className="mt-10">Get in touch</Eyebrow>
              <h1 className="display mt-5 text-3xl leading-9 font-bold md:text-4xl md:leading-[44px] lg:text-5xl lg:leading-[56px]">
                Let&apos;s build a campaign you can <span className="mark-block">prove</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed font-medium text-forest/65">
                Tell us what you&apos;re working on. A campaign strategist reads every request and comes back with a clear next step.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.18}>
            <div className="rounded-card bg-white p-2 shadow-[0_30px_70px_-40px_rgb(0_47_31/0.45)] ring-1 ring-forest/[0.06]">
              <p className="px-4 pt-3 pb-2 text-xs font-bold tracking-wider text-forest/45 uppercase">Prefer to talk directly?</p>
              <ul>
                {channels.map(({ icon: Icon, label, value, href, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-soft"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-forest text-orange transition-colors group-hover:bg-orange group-hover:text-ink">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold tracking-wider text-forest/45 uppercase">{label}</span>
                        <span className="mt-0.5 block truncate font-semibold text-forest">{value}</span>
                      </span>
                      <ArrowUpRight className="size-5 shrink-0 text-forest/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-orange" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-1 flex items-center gap-2.5 border-t border-forest/10 px-4 py-4 text-sm font-medium text-forest/60">
                <MapPin className="size-4 shrink-0 text-orange" aria-hidden="true" />
                {site.address}
                <LocalTime timeZone={site.timeZone} className="ml-auto" />
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative flow-root bg-soft pb-24 sm:pb-32">
        <div className="relative z-10 -mt-24 gutter sm:-mt-32">
          <Reveal y={40}>
            <ContactForm
              initialIntent={typeof intent === "string" ? intent : undefined}
              initialEmail={typeof email === "string" ? email.slice(0, 254) : undefined}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
