// Bottom CTA section — captures high-intent scrollers who reached the bottom
// Different headline from hero to reinforce without repeating
// Dark navy bg for visual contrast from white sections above
// Server Component

import Link from "next/link";

export default function BottomCtaSection() {
  return (
    <section
      className="px-6 py-28 text-center"
      style={{ backgroundColor: "var(--brand-navy-dark)" }}
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-4 text-4xl font-bold leading-tight text-white">
          Every Job You Finish Is a Review Waiting to Happen.
        </h2>
        <p className="mb-10 text-xl text-white/70">
          Start collecting reviews on autopilot today.
        </p>

        {/* Amber CTA — large, prominent */}
        <Link
          href="/auth/signup"
          className="inline-block rounded-lg px-10 py-4 text-lg font-bold transition-all hover:scale-[1.03] hover:opacity-90"
          style={{
            backgroundColor: "var(--brand-amber)",
            color: "var(--brand-navy)",
          }}
        >
          Start Getting Reviews — It&apos;s Free
        </Link>

        {/* Risk reducer */}
        <p className="mt-6 text-sm text-white/50">
          3 customers free · No credit card · Setup in 5 minutes
        </p>
      </div>
    </section>
  );
}
