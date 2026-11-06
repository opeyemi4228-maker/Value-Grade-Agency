# VGA Website: Handover Guide

Covers brief §12, "Documentation for forms, hosting, and analytics".

## Stack
- Next.js 16 (App Router), React 19, Tailwind CSS 4, Motion. Node 20.9 or later.
- `npm install`, then `npm run dev` for local work. Use `npm run build` followed by `npm start` for production.

## Sitemap (brief §7)
| Page | Route |
|---|---|
| Home | `/` |
| About | `/about` |
| For Brands (includes the Enterprise section) | `/for-brands` and `/for-brands#enterprise` |
| For Agencies | `/for-agencies` |
| For Creators | `/for-creators` |
| How It Works | `/how-it-works` |
| Compliance & Trust | `/compliance` |
| Contact / Book a Demo | `/contact`. Tabs are chosen with `?intent=proposal`, `call`, `general` or `creator` |
| Privacy Policy | `/privacy` |

`/sitemap.xml` and `/robots.txt` are generated automatically.

## Homepage
The homepage follows usegrade.com's flow, as requested by VGA, with the brief's §8 sections in it and VGA's own identity on top (dark-green hero and panels, orange accents, cream bands, Montserrat, the 8-step cycle). Note that brief §5 asks not to copy the reference layout. This was a deliberate decision by the project owner.

| Section (brief §8) | Component |
|---|---|
| Hero and dashboard (Verified Creators, Campaign Reach, Approved Payouts, Conversion Tracking, Compliance Status, ROI Report) | `components/home/Hero.jsx`, `components/home/HeroConsole.jsx` |
| Industry card strip (in place of client logos) | `components/home/IndustryCards.jsx` |
| Problem (Opacity, Friction, Risk) | inline in `app/(site)/page.jsx`, copy in `lib/content.js` (`problems`) |
| Solution (Find, Agree, Execute, Measure) as auto-advancing tabs | `components/home/SolutionSteps.jsx`, copy in `solutionSteps` |
| Services (6 product cards) | `components/home/ServiceCards.jsx`, copy in `services` |
| Who We Serve carousel | `components/home/AudienceCarousel.jsx`, cards in `lib/site.js` (`audiences`) |
| Campaign cycle (8 steps) | `components/CycleTimeline.jsx`, copy in `cycle` |
| Compliance (8 cards) | `components/home/ComplianceFeatures.jsx`, copy in `complianceFeatures` |
| Final CTA | `components/FinalCTA.jsx` |

All names and figures in the product mock-ups are fictional placeholder data (brief §13), labelled "Illustrative data" on the page.

`/contact` also accepts `?email=` to prefill the email field (e.g. from a future email-capture box).

## Editing content
- Shared copy (services, the campaign cycle, compliance cards, FAQs) lives in `lib/content.js`.
- Contact details, navigation, the audience cards and the announcement bar live in `lib/site.js`. **Items marked `TODO(VGA)` must be confirmed before launch.**
- Form dropdown options live in `lib/formOptions.js`. The server validates against the same lists.
- Page-specific copy is in `app/<page>/page.jsx`. Each page also exports its meta title and description there.
- In headlines, `[word]` gives that word the orange accent.

## Logo
`components/BrandMark.jsx` holds a vector redraw of the official mark, taken from the brief's letterhead. When VGA supplies the master SVG, replace the path data and keep the `viewBox`. That file feeds the header and footer logo, the hero, and the social image. The favicon (`app/icon.svg`) has its own copy of the paths.

## Forms (contact, proposal, strategy call, creator application, newsletter)
- Routes: `app/api/contact/route.js` and `app/api/newsletter/route.js`. Submissions are emailed through [Resend](https://resend.com).
- Required environment variables: `RESEND_API_KEY`, `FORMS_TO_EMAIL` (comma-separated for several recipients) and `FORMS_FROM_EMAIL` (must be on a domain verified in Resend).
- Spam protection: a hidden honeypot field, a minimum fill time, per-IP rate limiting, and optional Cloudflare Turnstile (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`).
- "Book a Strategy Call" opens `NEXT_PUBLIC_BOOKING_URL` (for example Calendly) when it is set. Otherwise it opens the call tab of the contact form.

## Admin dashboard (`/admin`)
- Sign in at `/admin/login` with `ADMIN_PASSWORD`. Set `ADMIN_SESSION_SECRET` to a long random string (`openssl rand -hex 32`). Sessions last 12 hours, and changing either value signs everyone out. Failed logins are rate-limited.
- **Dashboard**: KPIs against the previous period, enquiries over time, enquiry mix, busiest weekday, reply rate (target 80%, set by `RESPONSE_TARGET` in `lib/admin/metrics.js`), newsletter growth, top services, budgets and activity. Use **Add widget** to choose the widgets. The choice is saved per browser.
- **Enquiries** and **Creator applications**: filter, search, bulk status changes, CSV export. Each enquiry has a status pipeline (New → Contacted → Qualified → Converted, or Archived), internal notes, and one-click email, phone and WhatsApp replies.
- **Subscribers**: newsletter list with search, removal and CSV export.
- **Settings**: integration status, plus loading and removing fictional sample data (labelled "Sample"; real records are never touched).
- **Storage**: every form submission is still emailed and is *also* saved to the database (`lib/db.js`): Postgres via `DATABASE_URL` in production, or an embedded database in `./data/pglite` locally (no setup needed). An old `data/vga-admin.json` is imported automatically the first time.
- The code is in `app/admin/`, `components/admin/`, `lib/admin/`, `proxy.js` (login redirect) and `app/api/admin/export/`. Public pages live in `app/(site)/`; the route group doesn't change any URLs.

## Client & creator portal (accounts)
- **Who:** brands/agencies ("clients") and creators sign up at `/onboarding`, confirm their email, and log in at `/login`. Password reset is at `/forgot-password`. The portal lives at `/dashboard`.
- **Approval:** new accounts start as *pending* and see a "getting set up" screen. VGA links them in **/admin → Portal accounts**: tick the Grade campaigns a client may see (or paste campaign IDs), or set a creator's Grade email, then set the status to *Active*. Admins get an email for each sign-up.
- **Clients see:** overview KPIs, their linked campaigns with per-creator posts, views, likes and pending pay, the **payout approval queue** (approve or reject, with a confirm step; approving releases the money through Grade), and invoice PDFs for approved payouts.
- **Creators see:** total paid, payouts, receipt PDFs, and identity verification (KYC) status with a button that sends Grade's secure verification invite.
- **Security:** passwords are hashed with scrypt; sessions are random tokens in an HTTP-only cookie (only a hash is stored), 30 days, revoked on password change or when an account is disabled. Sign-up, login, reset and approvals are rate-limited. Every Grade read and action re-checks that the campaign, approval or invoice belongs to the signed-in user. Email links (verify/reset) are single-use and expire (48 h / 1 h).
- **Grade API:** `lib/grade/client.js` (server-only). Without `GRADE_BASE_URL`, `GRADE_APP_ID` and `GRADE_API_KEY` the portal runs in **demo mode** with sample data (`lib/grade/mock.js`) and shows a "Demo mode" banner. Add the keys to go live; the key needs campaigns read, `payouts:read`, `approvals:read`, `approvals:write` and KYC access. Docs: https://api-docs.usegrade.com
- **Emails:** verification and reset emails go through Resend (`RESEND_API_KEY`, `FORMS_FROM_EMAIL`). In local development without Resend, the links are printed in the terminal.
- **Code:** `app/(auth)/` (pages and actions), `app/dashboard/`, `components/auth/`, `components/portal/`, `lib/auth/`, `lib/grade/`, `lib/portal.js`, `lib/db.js`, `app/api/portal/invoice/[id]/route.js`, `app/admin/(panel)/accounts/`.

## SEO
- Every page sets its own title, description, canonical URL, Open Graph and Twitter card through `pageMeta()` in `lib/seo.js`. The social image is generated by `app/opengraph-image.jsx`.
- Structured data: Organization, WebSite and ProfessionalService on every page (`siteJsonLd()`), BreadcrumbList on inner pages, an OfferCatalog of services on the homepage, and FAQPage wherever FAQs appear.
- `/sitemap.xml` lists the public pages; `/robots.txt` blocks `/admin`, `/dashboard`, `/api` and the one-time auth pages, which are also `noindex`.
- Set `NEXT_PUBLIC_SITE_URL` to the live domain (canonicals and the sitemap use it) and `GOOGLE_SITE_VERIFICATION` to verify the site in Google Search Console, then submit the sitemap there.
- Social profile links in `lib/site.js` are only added to structured data once they point at real VGA profiles.

## Analytics and cookie consent
- Set `NEXT_PUBLIC_GA_ID` to the GA4 measurement ID (`G-XXXXXXX`). With IP anonymisation on, GA4 loads **only after the visitor accepts analytics cookies**.
- The cookie box (`components/CookieConsent.jsx`) offers Customise / Reject All / Accept All, with Essential, Analytics and Marketing categories. The choice is saved in the visitor's browser (`lib/consent.js`). Visitors can reopen it from "Cookie settings" in the footer or on the Privacy page. Bump `VERSION` in `lib/consent.js` to ask everyone again.

## Help bubble
`components/HelpNudge.jsx` shows the VGA button at the bottom right once the cookie choice is made. If a visitor is idle for 20 seconds, it shows "Still there? I can help you get started!", at most once per visit. Clicking it opens quick links to book a call, request a proposal, join as a creator, WhatsApp or email. It is hidden on `/contact`. Change `IDLE_MS` or the `actions` list in that file to adjust it.

## Hosting (recommended: Vercel)
1. Import the repository into Vercel. The framework is detected automatically.
2. Create a Postgres database (Vercel → Storage → Neon, free tier is fine) and set `DATABASE_URL` to its pooled connection string. Tables are created automatically on first request.
3. Add the other variables from `.env.example`, including `NEXT_PUBLIC_SITE_URL=https://www.valuegradeagency.com`, the Resend keys (needed for verification and reset emails) and, when available, the Grade keys.
4. Connect the domain. SSL is issued automatically.
Security headers are set in `next.config.mjs`.

## Pre-launch checklist (brief §13–14)
- [ ] Replace placeholder phone, WhatsApp, address and social links in `lib/site.js`.
- [ ] VGA approves all copy. Dashboard figures are illustrative and labelled as such.
- [ ] No client names, budgets, pricing or ROI projections are published.
- [ ] Test every form tab on staging and confirm the emails arrive.
- [ ] Check mobile and tablet layouts, and confirm GA4 is receiving data.
