// Pain agitation strip — full-width dark banner
// Psychological purpose: loss aversion before selling the solution
// NO CTA — pure emotional tension
// Server Component

const painPoints = [
  {
    icon: "😞",
    headline: "You finished the job. They meant to leave a review. They forgot.",
    sub: "Customers have good intentions — but life gets in the way within hours.",
  },
  {
    icon: "📉",
    headline: "Your competitor has 140 reviews. You have 12.",
    sub: "That gap compounds every week you don't have a system.",
  },
  {
    icon: "🔍",
    headline: "Google ranks the business with more reviews. Period.",
    sub: "Local search is a review arms race. Manual follow-up doesn't scale.",
  },
];

export default function PainStrip() {
  return (
    <section
      className="w-full px-6 py-14"
      style={{ backgroundColor: "var(--brand-navy-dark)" }}
    >
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {painPoints.map((point) => (
          <div key={point.headline} className="flex flex-col gap-2">
            <span className="text-2xl">{point.icon}</span>
            <p className="font-semibold leading-snug text-white">
              {point.headline}
            </p>
            <p className="text-sm leading-relaxed text-white/60">
              {point.sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
