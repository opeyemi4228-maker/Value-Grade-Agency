# VGA Website — Design Direction (from reference study)

References studied: spectup.com, to-top.ch, tipalti.com, blue2purple.com, broworks.net, beady.ai.
Note: the reference sites were studied from their content and structure. Motion and hover behaviour is inferred, not observed.

---

## 1. What each reference contributes

| Site | Steal this | Skip this |
|---|---|---|
| **spectup** | Numbered sections (01–08), dark palette with a single bright accent (like our green and orange), a sticky "Request call" button, and "partner accountability" messaging | Media-reach stats (VGA has no approved ones yet) |
| **to-top** | One metaphor carried through the whole site, headlines that ask the visitor questions ("Are these your concerns?"), numbered concern cards | Landscape photography and a playful tone (too soft for banks and telcos) |
| **tipalti** | A hero built from **cut-out fragments of product UI**, "AI with guardrails" framing (control over automation), stats with **footnotes on their sources**, trust links in the footer, a mega menu | Stock photos and a dense legal form |
| **blue2purple** | A short manifesto block, a newsletter with personality ("Sector news. Proven cases. Zero noise."), a final CTA that promises "no scripted pitch," and a value list ("One point of contact", "Total transparency") | Halftone multi-colour system (off-brand). QA warning: the live site shows leftover placeholder text ("This is some text inside of a div block", "©2xxx") |
| **broworks** | A **named methodology** as a sales asset (F.R.A.M.E.), a downloadable deck as the secondary CTA, an FAQ written so search engines and AI assistants can quote it, and case cards that lead with big metrics | Unverified "cited by ChatGPT/Claude" logos |
| **beady** | A metrics bar under the hero with "Up to" qualifiers, a **numbered step carousel (1 / 4)** with mock UI, a **comparison table** (us vs the alternatives) with a footnote, an audience grid, an industry grid, a "Set once. Monitor daily." rhythm, and disclaimers on fictitious demo data | 19 sections are too many. Keep VGA tight |

---

## 2. The big ideas for VGA

### A. One metaphor: "Graded & Verified"
VGA's name already carries it. Treat every claim, creator and payout as something that gets **checked, stamped and recorded**.
- Visual motif: a small orange check-stamp or "verified" seal, plus a ledger-style subtle grid (the brief's "subtle grid lines").
- Copy rhythm (in beady's style): *"Brief it. Verify it. Pay it. Prove it."*
- Microcopy: status pills such as `VERIFIED`, `APPROVED`, `PAID`, `REPORTED` appear on cards site-wide.

### B. A named method: **The Value Grade Cycle**
The brief's 8 steps become a branded process, the way broworks uses F.R.A.M.E.:
Brand Brief → Creator Matching → Execution → Analytics Verification → Invoice & Approval → Partner Payouts → Performance Review → Optimisation.
- On the homepage, show it as a horizontal timeline that pins while you scroll. The orange progress line fills as you go.
- Pair it with a "Download the VGA Capability Deck" secondary CTA (the PDF must be approved by VGA).

### C. "Growth with guardrails" (from Tipalti)
Big brands buy control, not hype. The compliance section should frame VGA as **creator marketing that finance, legal and compliance sign off on**.
- Headline idea: *"Creator marketing your finance team will sign off on."*
- Promise line (adapted from beady's "source link on every signal"): *"Every payout traced to a verified deliverable."*

### D. A hero built from product fragments, not one big screenshot
Tipalti's approach: 5–6 floating dashboard cards (Verified Creators, Campaign Reach, Approved Payouts, Conversion Tracking, Compliance Status, ROI Report) stacked with depth over a deep green grid.
- Numbers count up on load, and one "Payout approved ✓" toast slides in on a loop.
- Small caption: *"Illustrative data."* (beady-style disclaimer, which also satisfies the confidentiality rules).

### E. A comparison table instead of only "problem cards" (from beady)
Keep the three Problem cards (Opacity / Friction / Risk), then follow them with:

| | Typical influencer marketplace | In-house spreadsheets | **VGA** |
|---|---|---|---|
| Pricing clarity | Varies | Manual | Agreed upfront |
| Creator verification | Self-declared | Ad hoc | KYC-checked |
| Approvals | Chat threads | Email | One structured flow |
| Reporting | Screenshots | Manual | Verified analytics |
| Payout records | Limited | Scattered | Audit-ready |

Footnote: *"Reflects typical market models; individual providers may differ."*

---

## 3. Homepage, section by section (merged plan)

| # | Section | Pattern borrowed |
|---|---|---|
| — | Optional announcement bar | blue2purple / broworks |
| — | Sticky header, "Solutions" mega menu (Brands / Agencies / Creators / Enterprises), orange "Book a Strategy Call" button | tipalti, spectup |
| 01 | **Hero**: headline, 2 CTAs, layered dashboard fragments, "Illustrative data" caption | tipalti |
| — | **Industry strip** instead of client logos (Telecoms · Banking · Fintech · FMCG · Agencies · Enterprise), because no logos are approved | beady (adapted) |
| — | **Capability metrics bar**: 4 figures, each with a footnote. Use placeholders until VGA approves them | beady, tipalti |
| 02 | **Problem**: "Influencer Marketing Has a Trust Problem", 3 cards, then the comparison table | to-top (question headline), beady |
| 03 | **Solution**: Find → Agree → Execute → Measure as a numbered carousel ("1 / 4"), each step with a mini UI mock | beady |
| 04 | **Services**: 6 cards, each with a tiny UI illustration instead of a generic icon | tipalti AI-agent grid |
| 05 | **Who We Serve**: 4 large cards linking to the audience pages | beady audience grid |
| 06 | **The Value Grade Cycle**: 8-step pinned timeline, plus the deck download | broworks F.R.A.M.E. |
| 07 | **Compliance & Trust**: "Growth with guardrails", 8 feature cards on a cream background | tipalti |
| 08 | **FAQ**: 6–8 Q&As, accordion, with FAQPage schema markup | broworks, beady |
| 09 | **Final CTA**: "Ready to Turn Creator Spend Into Measurable Growth?", plus "A 30-minute call with a strategist. No scripted pitch." | blue2purple, broworks |
| — | **Footer**: newsletter ("Campaign insight. Verified results. Zero noise."), sitemap, trust links (KYC, Privacy, Payment Records), contact and WhatsApp, offices | blue2purple, tipalti |

Reserve testimonial and case-study slots (broworks style: metric-first cards) but hide them until VGA approves content.

---

## 4. Visual system

- **Backgrounds:** Shadow `#011C13` → Forest `#002F1F` gradient for dark sections, with a 1px emerald grid at about 8% opacity. Cream `#F7F4EC` for the Compliance and FAQ sections to give the scroll some rhythm.
- **Orange `#FF6A00`:** only for CTAs, section numbers (01, 02…), timeline progress, chart lines and status dots. It should never fill a large area.
- **Type:** a sharp geometric sans for headlines (e.g. *Sora*, *Manrope* or *General Sans*), *Inter* for body text, and a mono face (e.g. *JetBrains Mono*) for numbers and status pills to give a "data" feel.
- **Cards:** emerald surface `#01402B` at 40–60% opacity, a 1px soft-white border at 8%, 16–20px radius, and an orange top-edge glow on hover.
- **Motion:** gentle and purposeful. Count-up numbers, fade-up on scroll, the pinned timeline, a slow logo or industry marquee. Respect `prefers-reduced-motion`.

---

## 5. QA lessons from the references

- Before launch, search the build for "lorem", "placeholder", "2xxx", "div block" and "TODO" (blue2purple shipped placeholder text).
- Every number on the site needs a source footnote or a VGA sign-off (tipalti does this well).
- Make no claims we can't prove, such as AI citations or partner badges (broworks).
- Keep the homepage to about 9 sections. Beady's 19 sections are too many.
