// Pricing section — 3-tier: Free / Starter / Pro
// Scroll anchor: id="pricing"
// Server Component

import Link from 'next/link';
import { PRICING_PLANS } from '@/lib/config/pricing-plans';

export default function PricingSection() {
  return (
    <section
      id='pricing'
      className='scroll-mt-20 px-6 py-24'
      style={{ backgroundColor: 'var(--brand-bg)' }}
    >
      <div className='mx-auto max-w-6xl'>
        {/* Heading */}
        <div className='mb-16 text-center'>
          <h2
            className='mb-4 text-4xl font-bold tracking-tight'
            style={{ color: 'var(--brand-navy)' }}
          >
            Simple Pricing. No Surprises.
          </h2>
          <p className='text-lg' style={{ color: 'var(--text-muted)' }}>
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        {/* 3-column cards */}
        <div className='grid gap-6 md:grid-cols-3 md:items-start'>
          {PRICING_PLANS.map((tier) => (
            <div
              key={tier.name}
              className='flex flex-col rounded-2xl bg-white p-8 shadow-sm'
              style={{
                border: tier.highlight
                  ? '2px solid var(--brand-navy)'
                  : '1px solid #e5e7eb',
                boxShadow: tier.highlight
                  ? '0 4px 24px rgba(27,43,75,0.10)'
                  : undefined,
              }}
            >
              {/* Badge or spacer */}
              {tier.badge ? (
                <span
                  className='mb-4 self-start rounded-full px-3 py-1 text-xs font-bold'
                  style={{
                    backgroundColor: tier.badge.color,
                    color: tier.badge.text,
                  }}
                >
                  {tier.badge.label}
                </span>
              ) : (
                <div className='mb-4 h-6' /> // spacer keeps cards aligned
              )}

              {/* Name */}
              <h3
                className='mb-1 text-2xl font-bold'
                style={{ color: 'var(--brand-navy)' }}
              >
                {tier.name}
              </h3>

              {/* Price */}
              <div className='mb-1'>
                <span
                  className='text-4xl font-bold'
                  style={{ color: 'var(--text-primary)' }}
                >
                  {tier.price}
                </span>
                <span
                  className='text-lg font-normal'
                  style={{ color: 'var(--text-muted)' }}
                >
                  {' '}
                  {tier.period}
                </span>
              </div>

              {/* ROI note or spacer */}
              <p
                className='mb-6 text-xs italic'
                style={{ color: 'var(--text-muted)', minHeight: '1rem' }}
              >
                {tier.roiNote ?? ''}
              </p>

              {/* Feature list */}
              <ul className='mb-8 flex flex-col gap-3'>
                {tier.features.map((f) => {
                  const isLimitation = tier.limitations.includes(f);
                  return (
                    <li
                      key={f}
                      className='flex items-start gap-2 text-sm'
                      style={{
                        color: isLimitation
                          ? 'var(--text-muted)'
                          : 'var(--text-primary)',
                      }}
                    >
                      <span
                        className='mt-0.5 shrink-0'
                        style={{
                          color: isLimitation
                            ? 'var(--text-muted)'
                            : 'var(--brand-emerald)',
                        }}
                      >
                        {isLimitation ? '·' : '✓'}
                      </span>
                      {f}
                    </li>
                  );
                })}
              </ul>

              {/* CTA */}
              <Link
                href='/auth/signup'
                className='mt-auto rounded-lg px-6 py-3 text-center text-sm font-bold transition-all hover:scale-[1.02] hover:opacity-90'
                style={
                  tier.cta.style === 'amber'
                    ? {
                        backgroundColor: 'var(--brand-amber)',
                        color: 'var(--brand-navy)',
                      }
                    : {
                        border: '2px solid var(--brand-navy)',
                        color: 'var(--brand-navy)',
                      }
                }
              >
                {tier.cta.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Risk reducer */}
        <p
          className='mt-8 text-center text-sm'
          style={{ color: 'var(--text-muted)' }}
        >
          No contracts. Cancel anytime. Upgrade or downgrade whenever.
        </p>

        {/* Payment provider attribution */}
        <p className='mt-3 text-center text-xs' style={{ color: 'var(--text-muted)' }}>
          Secure checkout by{' '}
          <a
            href='https://polar.sh'
            target='_blank'
            rel='noopener noreferrer'
            className='underline-offset-2 hover:underline'
            style={{ color: 'var(--text-muted)' }}
          >
            Polar
          </a>
        </p>
      </div>
    </section>
  );
}
