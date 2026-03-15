// Footer — minimal, dark navy bg continues from bottom CTA section
// Privacy/Terms links are placeholders until real pages exist
// Server Component

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t px-6 py-8"
      style={{
        backgroundColor: "var(--brand-navy-dark)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        {/* Logo */}
        <span className="text-base font-bold text-white">Review Nudge</span>

        {/* Nav links */}
        <nav className="flex items-center gap-6">
          <Link href="#" className="text-sm text-white/50 transition-colors hover:text-white/80">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm text-white/50 transition-colors hover:text-white/80">
            Terms of Service
          </Link>
          <Link href="#" className="text-sm text-white/50 transition-colors hover:text-white/80">
            Contact
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-sm text-white/40">
          © 2026 Review Nudge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
