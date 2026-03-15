"use client";

// FAQ accordion — removes objections before checkout
// "use client" required for open/close accordion state
// Scroll anchor: id="faq"

import { useState } from "react";

const faqs = [
  {
    question: "Will it feel spammy to my customers?",
    answer:
      "The email is warm and personal — sent once per completed job, at the right time (configurable delay, default 2 hours). Customers expect follow-up from a business they just hired. It reads like a genuine thank-you, not a mass blast.",
  },
  {
    question: "Is it hard to set up?",
    answer:
      "Under 5 minutes. Paste your Google Review URL in settings, add a customer, log a job — done. No integrations, no API keys, no tech skills required.",
  },
  {
    question: "What if they already left a review?",
    answer:
      "We track every email click. Once a customer clicks the review link, their job status updates automatically. You can also manually mark any job as 'Reviewed' and no further emails are sent.",
  },
  {
    question: "Do I need a CRM or existing software?",
    answer:
      "No. Review Nudge is self-contained. Manual job logging is all you need to get started — no integrations, no imports, no existing tools required.",
  },
  {
    question: "How is this different from Podium or NiceJob?",
    answer:
      "Those tools are built for enterprises with multi-location teams and priced accordingly ($200–500/month). Review Nudge is purpose-built for small service businesses — simple dashboard, affordable pricing, zero bloat. You're paying for exactly what you need.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes — no questions asked, anytime. If you're not happy, just cancel and request a refund. You don't need to explain yourself or wait for approval. We'd rather you leave happy than stay frustrated.",
  },
];

// Single accordion item — manages its own open state via parent
function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span
          className="text-base font-semibold"
          style={{ color: "var(--brand-navy)" }}
        >
          {faq.question}
        </span>
        <span
          className="flex-shrink-0 text-xl font-light transition-transform"
          style={{
            color: "var(--brand-navy)",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          +
        </span>
      </button>

      {/* Answer — smooth height transition via max-height */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? "300px" : "0px" }}
      >
        <p
          className="pb-5 leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function FaqSection() {
  // Track which item is open by index; null = all closed
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="scroll-mt-20 bg-white px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h2
          className="mb-12 text-center text-4xl font-bold tracking-tight"
          style={{ color: "var(--brand-navy)" }}
        >
          Common Questions
        </h2>

        <div>
          {faqs.map((faq, index) => (
            <FaqItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
