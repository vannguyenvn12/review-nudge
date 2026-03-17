'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PAID_PLANS } from '@/lib/config/pricing-plans';

interface UpgradeModalProps {
  starterProductId: string;
  proProductId: string;
}

/**
 * Pricing modal shown when the user clicks "Upgrade" on the settings page.
 * Posts to /api/checkout with the selected product ID, then redirects to Polar checkout.
 * Plan data comes from @/lib/config/pricing-plans — edit there to update copy/features.
 */
export default function UpgradeModal({
  starterProductId,
  proProductId,
}: UpgradeModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<'starter' | 'pro' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const productIds = { starter: starterProductId, pro: proProductId };

  async function handleChoose(tier: 'starter' | 'pro') {
    setLoading(tier);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productIds[tier] }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Checkout failed');
      router.push(json.checkoutUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(null);
    }
  }

  return (
    <>
      {/* Upgrade trigger button */}
      <button
        onClick={() => setOpen(true)}
        className='rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors'
      >
        Upgrade
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className='w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl'>
            {/* Header */}
            <div className='mb-6 flex items-start justify-between'>
              <div>
                <h2 className='text-2xl font-bold text-gray-900'>
                  Choose a plan
                </h2>
                <p className='mt-1 text-sm text-gray-500'>
                  Unlock more review requests and features.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className='rounded-md p-1 text-gray-400 hover:text-gray-600'
                aria-label='Close'
              >
                ✕
              </button>
            </div>

            {/* Plan cards — sourced from PAID_PLANS (excludes Free tier) */}
            <div className='grid gap-4 sm:grid-cols-2'>
              {PAID_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-lg border-2 p-6 ${
                    plan.highlight
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {plan.highlight && (
                    <span className='absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-semibold text-white'>
                      Most popular
                    </span>
                  )}

                  <div className='mb-4'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {plan.name}
                    </h3>
                    <div className='mt-1 flex items-baseline gap-1'>
                      <span className='text-3xl font-bold text-gray-900'>
                        {plan.price}
                      </span>
                      <span className='text-sm text-gray-500'>
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  <ul className='mb-6 flex-1 space-y-2'>
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className='flex items-center gap-2 text-sm text-gray-700'
                      >
                        <span className='text-green-500'>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleChoose(plan.id)}
                    disabled={loading !== null}
                    className={`w-full rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
                      plan.highlight
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                        : 'bg-gray-900 text-white hover:bg-gray-700'
                    }`}
                  >
                    {loading === plan.id
                      ? 'Redirecting…'
                      : `Choose ${plan.name}`}
                  </button>
                </div>
              ))}
            </div>

            {error && (
              <p className='mt-4 text-center text-sm text-red-600'>{error}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
