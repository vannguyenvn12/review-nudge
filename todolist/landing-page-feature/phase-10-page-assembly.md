# Phase 10 — Page Assembly

**Status:** ✅ DONE
**Priority:** HIGH — final integration step, depends on all phases 01–09

---

## File to Modify

`app/page.tsx` — **full replacement** of boilerplate content

---

## Dependencies
All previous phases (00–09) must be complete before this phase.

---

## Tasks

- [ ] Remove all default Next.js boilerplate (Image imports, SVGs, template links)
- [ ] Import all landing section components:
  ```tsx
  import Navbar from "@/app/components/landing/navbar"
  import HeroSection from "@/app/components/landing/hero-section"
  import PainStrip from "@/app/components/landing/pain-strip"
  import HowItWorksSection from "@/app/components/landing/how-it-works-section"
  import PricingSection from "@/app/components/landing/pricing-section"
  import SocialProofStrip from "@/app/components/landing/social-proof-strip"
  import FaqSection from "@/app/components/landing/faq-section"
  import BottomCtaSection from "@/app/components/landing/bottom-cta-section"
  import Footer from "@/app/components/landing/footer"
  ```
- [ ] Assemble in correct order:
  ```tsx
  <main>
    <Navbar />
    <HeroSection />
    <PainStrip />
    <HowItWorksSection />
    <PricingSection />
    <SocialProofStrip />
    <FaqSection />
    <BottomCtaSection />
    <Footer />
  </main>
  ```
- [ ] Page background set to `--brand-bg` (`#F8F7F4`) via body or wrapper
- [ ] No `"use client"` on `page.tsx` itself (FaqSection handles its own client boundary)

---

## Success Criteria
- [ ] `localhost:3000` shows complete landing page
- [ ] All 9 sections visible in correct order
- [ ] No hydration errors in browser console
- [ ] TypeScript: no errors
