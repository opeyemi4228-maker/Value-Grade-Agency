import { pageMeta } from "@/lib/seo";
import Eyebrow from "@/components/Eyebrow";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "How Value Grade Agency collects, uses and protects personal information submitted through this website.",
  path: "/privacy",
});

// TODO(VGA): have this reviewed by VGA's legal adviser before launch (e.g. for NDPA/GDPR alignment).
const sections = [
  ["Information we collect", "When you submit a form on this website we collect the details you provide, such as your name, company, role, email address, phone number and message. We also collect basic, anonymised usage data through analytics to improve the website."],
  ["How we use it", "We use your information to respond to your enquiry, prepare proposals, arrange calls and, if you subscribe, send our newsletter. We do not sell your personal information."],
  ["Cookies", "We use essential cookies to run the website and remember your cookie choice. With your consent, we also use analytics cookies (Google Analytics) to understand how the site is used, and marketing cookies to measure our campaigns. Analytics and marketing cookies are off until you accept them, and you can change your choice at any time."],
  ["Sharing", "We share information only with service providers who help us operate this website and respond to you (for example, email delivery and spam protection), and only as needed for those purposes."],
  ["Retention", "We keep enquiry information for as long as needed to respond and manage any resulting relationship, or as required by law."],
  ["Your rights", "You can ask us to access, correct or delete your personal information, or unsubscribe from our newsletter at any time."],
  ["Contact", `For privacy questions, email ${site.email}.`],
];

export default function PrivacyPage() {
  return (
    <section className="bg-cream pt-44 pb-24 sm:pt-52">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="display mt-5 text-3xl leading-9 font-bold md:text-4xl md:leading-[44px] lg:text-5xl lg:leading-[56px] text-forest">Privacy Policy</h1>
        <p className="mt-5 text-sm font-medium text-forest/60">Last updated: November 2026</p>
        <div className="mt-14 grid gap-10 border-t border-forest/10 pt-12">
          {sections.map(([h, p]) => (
            <div key={h}>
              <h2 className="text-lg leading-7 font-semibold tracking-[-0.02em] md:text-xl text-forest">{h}</h2>
              <p className="mt-3 leading-relaxed font-medium text-forest/75">{p}</p>
              {h === "Cookies" && (
                <CookieSettingsButton className="mt-5 inline-flex h-11 items-center rounded-full bg-forest px-5 text-sm font-bold text-soft transition-colors hover:bg-orange hover:text-ink" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
