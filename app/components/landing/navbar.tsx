// Sticky top navbar — navy bg, logo, nav links, amber CTA
// Server Component — no client-side interactivity needed

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: "var(--brand-navy)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-white tracking-tight"
        >
          Review Nudge
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            How It Works
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            FAQ
          </Link>
        </div>

        {/* CTA button — amber, navy text */}
        <Link
          href="/auth/signup"
          className="rounded-lg px-5 py-2.5 text-sm font-bold transition-all hover:scale-[1.03] hover:opacity-90"
          style={{
            backgroundColor: "var(--brand-amber)",
            color: "var(--brand-navy)",
          }}
        >
          Start Free
        </Link>
      </div>
    </nav>
  );
}
