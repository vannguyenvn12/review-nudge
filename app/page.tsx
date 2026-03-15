// Landing page — Review Nudge
// Assembles all landing section components in conversion-optimized order:
// Navbar → Hero → Pain → How It Works → Pricing → Social Proof → FAQ → Bottom CTA → Footer
// Server Component (FaqSection handles its own "use client" boundary internally)

import Navbar from "@/app/components/landing/navbar";
import HeroSection from "@/app/components/landing/hero-section";
import PainStrip from "@/app/components/landing/pain-strip";
import HowItWorksSection from "@/app/components/landing/how-it-works-section";
import PricingSection from "@/app/components/landing/pricing-section";
import SocialProofStrip from "@/app/components/landing/social-proof-strip";
import FaqSection from "@/app/components/landing/faq-section";
import BottomCtaSection from "@/app/components/landing/bottom-cta-section";
import Footer from "@/app/components/landing/footer";

export default function Home() {
  return (
    <main style={{ backgroundColor: "var(--brand-bg)" }}>
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
  );
}
