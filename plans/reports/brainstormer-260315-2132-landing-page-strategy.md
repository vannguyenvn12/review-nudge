# Brainstorm Report: Review Nudge Landing Page Strategy

**Date:** 2026-03-15 | **Slug:** landing-page-strategy
**Role:** Brainstormer | **Output:** Strategic recommendations (NO CODE)

---

## 1. Conversion-Focused Page Sections (Order + Psychology)

---

### S1 - Hero (Above the Fold)
**Position:** #1, non-negotiable
**Psychological principle:** Clarity + Specificity over cleverness. Vague = bounce.

Visitors decide in ~3s whether to stay. Must pass the billboard test.

**What to nail:**
- Headline outcome-first, not feature-first
  - BAD: Automated Review Requests
  - GOOD: Your Customers Will Leave Reviews. Without You Asking.
- Sub-headline: Log a completed job, Review Nudge emails your customer at the right moment, automatically
- Single primary CTA above fold
- Product screenshot or phone mockup showing email preview (visual proof the product is real)
- Social proof hook: Trusted by 200+ contractors in small text under CTA

---

### S2 - Pain Agitation Strip (Narrow Full-Width Banner)
**Position:** Immediately after hero
**Psychological principle:** Loss aversion (Kahneman). Pain of loss > joy of gain.

**What to nail:**
- 3-4 punchy pain bullets in a dark/accent banner (no CTA here, pure tension):
  - You finished the job. They meant to leave a review. They forgot.
  - Your competitor has 140 reviews. You have 12.
  - Google ranks the business with more reviews. Period.

---

### S3 - How It Works (3-Step Process)
**Position:** #3, right after pain
**Psychological principle:** Simplicity bias. Simpler path = more likely to start.

Service business owners are busy and tech-skeptical. Show it is dead simple.

**What to nail:**
- Exactly 3 steps with numbered icons:
  1. Add your Google Review link (30 seconds)
  2. Log a completed job with customer email
  3. Review Nudge emails them automatically at the right time
- Animated or illustrated flow diagram between steps
- Tagline: That is it. No integrations. No complicated setup.

---

### S4 - Product Demo / Screenshot Showcase
**Position:** #4
**Psychological principle:** Tangibility bias. Abstract software feels risky; visible UI feels real and safe.

**What to nail:**
- Dashboard screenshot: job log + review request status table
- Email preview: what the customer actually receives (warm, personal tone, not spammy)
- Mobile screenshot of the email on a phone
- Annotated callouts pointing to key features
- Caption: The email that gets reviews sent on your behalf, every time.

---

### S5 - Social Proof / Testimonials
**Position:** #5
**Psychological principle:** Social proof (Cialdini). People copy what people like them do.

Most powerful trust signal. Visitors are interested but skeptical at this point.

**What to nail:**
- 3 testimonials minimum with industry-specific names/roles:
  - Mike D., HVAC Contractor, Austin TX
  - Sarah W., Residential Cleaning, Denver CO
  - Jason K., General Contractor, Phoenix AZ
- Each testimonial must contain a specific outcome: I went from 8 reviews to 47 in 3 months
- Real headshots preferred (stock is better than initials)
- 5-star rating displayed visually
- Optional: Google review count before/after stat

---

### S6 - Objection Crusher / FAQ
**Position:** #6
**Psychological principle:** Anticipated regret reduction. Answering objections = removing exit doors.

**Top objections to pre-empt:**
- Will it feel spammy to my customers? -- Show the warm, personal email template
- Is it hard to set up? -- Under 5 minutes, no tech skills needed
- What if the customer already left a review? -- We track click status and pause automatically
- How much does it cost? -- Teaser and link to pricing section
- Do I need to integrate with my CRM? -- No. Manual job logging works fine.

**Format:** Accordion FAQ or 2-col Q&A grid

---

### S7 - Pricing
**Position:** #7
**Psychological principle:** Anchoring + decoy effect. Framing: 9/mo is less than 1 new customer.

By now visitors are warm. Hiding pricing loses them. Transparency = trust.

**What to nail:**
- 2 tiers max (Starter + Pro) -- avoid paradox of choice
- Highlight recommended plan with Most Popular badge
- Annual/monthly toggle (anchor annual as default for higher LTV)
- Feature list focused on outcomes not tech specs
- Start free for 14 days removes purchase risk
- Single CTA per plan

---

### S8 - Final CTA / Bottom Hero
**Position:** Last section
**Psychological principle:** Commitment escalation. Having read this far they have invested attention -- a final nudge converts it.

**What to nail:**
- Restate core promise headline (different wording from S1)
- Single CTA button -- large, prominent
- Risk-reducer below button: No credit card. Cancel anytime. 5-minute setup.
- Optional: Join 200+ service businesses getting more reviews

---

## 2. UI/UX Decisions

### Layout
- Single column, vertical scroll -- no sidebars, no distractions. Every element serves conversion.
- Max content width 1140px -- centered on large screens, does not strain reading
- Sticky nav with CTA button always visible as user scrolls -- lazy scroll = lost CTA
- Nav items only: Features | How It Works | Pricing | [CTA Button]

### Visual Hierarchy
- Rule of three per section: headline, supporting visual/copy, CTA
- One primary CTA color used ONLY for action buttons -- never decorative
- Generous whitespace between sections (80-120px vertical padding) -- breathing room = premium feel
- Product screenshots get drop shadows + light device frames (looks placed in reality)

### CTA Placement (5 total, all same destination: signup)
1. Above fold (hero)
2. After How It Works
3. After pricing (per plan)
4. Bottom hero
5. Sticky nav (always visible)

### CTA Copy
- AVOID: Get Started, Sign Up, Submit
- PRIMARY: Start Getting Reviews Free
- SECONDARY (lower commitment for cold traffic): See How It Works

### Micro-interactions
- CTA button: subtle scale(1.03) on hover + shadow lift
- How It Works steps: sequential fade-in on scroll (Intersection Observer)
- FAQ accordion: smooth expand/collapse
- Screenshots: slight parallax scroll effect (do not overdo)
- Pricing toggle: smooth slide animation

### Trust Signals
- Logos of tools used: Google, Resend -- Powered by strip
- No credit card required near every CTA
- Lock icon + Your data is encrypted near signup form
- Customer review count growing ticker if real data exists

---

## 3. Color Palette

**Rationale:** Target audience (contractors, trades, agencies) responds to authority + reliability, not playfulness. Need warmth to feel approachable. High contrast for accessibility and CTAs that pop.

| Role | Name | Hex | Psychology |
|------|------|-----|------------|
| Background | Off-White | #F8F7F4 | Warm, not clinical. Softer than pure white |
| Primary Brand | Deep Navy | #1B2B4B | Authority, trust, professionalism -- trades respect this |
| Accent / CTA | Electric Amber | #F59E0B | Urgency, energy, stands out on navy |
| Secondary CTA | Warm Slate | #64748B | Ghost buttons, secondary actions |
| Success / Positive | Emerald | #10B981 | Reviews working, status indicators |
| Text Primary | Near Black | #111827 | High contrast body text |
| Text Muted | Gray | #6B7280 | Captions, helper text |
| Section Contrast | Dark Navy | #0F1C33 | Pain strip + bottom CTA background |
| Card/Surface | White | #FFFFFF | Pricing cards, testimonials |

**Usage Rules:**
- #F59E0B (Amber) ONLY on primary CTAs -- never decorative. Trains eye: action = amber.
- Navy as primary text on light BG, white text on dark sections
- Green for status badges (Review Sent, Reviewed) -- ties to product UI

**Trade-off:** Amber CTAs test well for trades/blue-collar but can feel less premium SaaS. Acceptable -- conversion beats aesthetics. If repositioning upmarket later, swap Amber for #2563EB blue.

---

## 4. Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Headlines | Plus Jakarta Sans | 700-800 | Modern, confident, slightly geometric. Not overused like Inter |
| Body / UI | Inter | 400-500 | Proven legibility, safe, universal |
| Numbers / Stats | Plus Jakarta Sans | 800 | Big stat callouts look punchy |

**Why this pairing:**
- Plus Jakarta Sans has personality without being quirky -- works for trades + digital native users
- Inter has universal legibility, familiar in most SaaS products (familiar = trusted)
- Never use more than 2 font families

**Sizing Scale:**
- H1 (hero): 52-64px desktop, 36px mobile
- H2 (section): 36-42px desktop, 28px mobile
- Body: 17-18px (slightly larger than 16px -- more comfortable on landing pages)
- Captions: 13-14px

**Avoid:** Serif fonts (too editorial), Script/decorative (too casual), System fonts (lack brand identity)

---

## 5. Section-by-Section Copywriting Angle

| Section | Emotion Targeted | Pain Point | Core Message Frame |
|---------|-----------------|------------|--------------------|
| Hero | Hope + Curiosity | I work hard but never get reviews | Promise the outcome: 5-star reviews on autopilot |
| Pain Strip | Frustration + Fear | Competitors beating me on Google | Make the cost of inaction visceral |
| How It Works | Relief + Confidence | Software is complicated and I have no time | 3 steps. Dead simple. You can do this. |
| Screenshots | Trust + Desire | Cannot picture how this works for my business | This is what you get. Here is what your customer sees. |
| Testimonials | Belonging + FOMO | Does this work for people like me? | Contractors exactly like you are using this right now |
| FAQ | Skepticism Reduction | There is probably a catch | Pre-answer every blocker before they think of it |
| Pricing | Fairness + ROI | Is it worth it? | Reframe: one new customer from a review pays for a year |
| Bottom CTA | Decisiveness + Urgency | I will look into it later | Start free today -- set up in 5 minutes |

---

## 6. What NOT To Do

**1. Feature-first headline**
- BAD: Automated Review Request Software for Service Businesses
- GOOD: Your Customers Will Leave Reviews. Without You Lifting a Finger.
- Trade-off: Feature copy ranks better for SEO but kills cold conversion. Use in meta description only.

**2. Multiple CTAs with different destinations**
- Every CTA should go to signup. No competing Book a Demo, Watch Video, Start Free, Contact Us.

**3. Generic stock photos of happy business owners**
- Product screenshots + real customer emails perform 2-3x better.
- If using a person: real photo of a plumber or contractor at work -- industry-specific beats generic.

**4. Vague social proof**
- BAD: Loved by businesses everywhere
- GOOD: Mike from Austin HVAC went from 8 to 54 Google reviews in 90 days
- Specificity = credibility

**5. Hiding pricing or CTA too far down**
- Many SaaS sites make visitors scroll 80% before seeing a CTA. Warm visitors leave before they get there.

**6. Autoplay video in hero**
- Kills page load speed. Kills mobile experience. Kills trust.
- Use static screenshot or play-button-over-thumbnail approach.

**7. No mobile optimization**
- Target audience (contractors, tradespeople) is heavily mobile. If page breaks on mobile, lose 50%+ of traffic.

**8. Learn More as primary CTA**
- Passive, non-committal. Signals the page is not ready to convert. Use action-oriented verbs.

**9. Long-form paragraphs in hero or features**
- Service business owners will not read walls of text. Max 2 sentences per section intro. Use bullets.

**10. Testimonials without specifics**
- BAD: Great product, highly recommend\! -- John
- GOOD: I got 3 new reviews in the first week. Setup took 10 minutes. -- Mike D., Austin HVAC

**11. Pop-ups on first page load**
- Exit-intent is okay. Immediate pop-up = rage-close. Lose the visitor before they read the hero.

**12. Nav with 8 items**
- Decision fatigue. Reduce to 3-4 items + 1 CTA. Navigation is an exit door -- minimize it.

---

## Trade-Off Summary

| Decision | Conversion Gain | Trade-Off |
|----------|----------------|----------|
| Amber CTAs | High (stands out, action-oriented) | Slightly less premium SaaS feel |
| Single CTA action | High (no confusion) | Cannot test multiple conversion paths early |
| No video in hero | Medium (speed, mobile) | Less engaging for visual learners |
| Manual job logging shown | High (removes integration fear) | May undersell power users |
| 2 pricing tiers only | Medium (reduces choice paralysis) | Harder to upsell enterprise |
| Pain strip before how-it-works | High (emotional buy-in) | Can feel aggressive if tone is off |

---

## Unresolved Questions

1. Do real customer testimonials exist yet? Fake/placeholder testimonials hurt trust more than none. Need early social proof strategy (beta users + free trial exchange).
2. Is there a free tier or only a trial? Free forever vs 14-day trial have very different conversion profiles and positioning implications.
3. What is the primary acquisition channel? Google Ads vs organic SEO vs cold email changes hero copy significantly.
4. Is manual job logging the only way to add jobs? If CSV import or API exists later, hint in FAQs to convert tech-forward users.
5. What is the pricing structure -- per-seat, per-email-sent, or flat monthly? This changes how to frame ROI in the pricing section.
6. What is the competitor differentiation gap vs NiceJob, BirdEye, Podium? That gap is the wedge for the hero subheadline.
