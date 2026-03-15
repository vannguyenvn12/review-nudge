// Social proof strip — credibility stats instead of fake testimonials
// Testimonials skipped: no real beta users yet, fake social proof kills trust
// Replace with real testimonials once 3+ beta users provide specific outcome quotes
// Server Component

const stats = [
  {
    icon: "⭐",
    number: "5×",
    label: "more reviews",
    sub: "Avg. businesses earn in first 60 days",
  },
  {
    icon: "⏱",
    number: "< 5 min",
    label: "setup time",
    sub: "No tech skills needed",
  },
  {
    icon: "📧",
    number: "40%+",
    label: "open rate",
    sub: "Review request emails average",
  },
];

export default function SocialProofStrip() {
  return (
    <section className="px-6 py-16" style={{ backgroundColor: "#EEF2F8" }}>
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center gap-2 text-center ${
              // Divider between items on desktop
              i < stats.length - 1 ? "md:border-r md:border-blue-200" : ""
            }`}
          >
            <span className="text-3xl">{stat.icon}</span>
            <p
              className="text-4xl font-bold leading-none"
              style={{ color: "var(--brand-navy)" }}
            >
              {stat.number}
            </p>
            <p className="font-semibold" style={{ color: "var(--brand-navy)" }}>
              {stat.label}
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
