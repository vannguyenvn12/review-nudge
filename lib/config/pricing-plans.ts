/**
 * Single source of truth for all pricing plan data.
 * Used by both the landing page PricingSection and the dashboard UpgradeModal.
 *
 * To update pricing, features, or copy — edit this file only.
 */

export type PlanId = 'free' | 'starter' | 'pro';

export interface PricingPlan {
  /** Unique identifier — maps to profiles.subscription_tier */
  id: PlanId;
  name: string;
  price: string;
  /** Monthly billing note shown below price */
  period: string;
  /** Short ROI/value note shown on landing page cards (null = no note) */
  roiNote: string | null;
  /** Badge shown on the plan card (null = no badge) */
  badge: { label: string; color: string; text: string } | null;
  /** Highlighted / "most popular" styling */
  highlight: boolean;
  features: string[];
  /**
   * Subset of features that are limitations (shown with a muted marker instead
   * of a checkmark on the landing page).
   */
  limitations: string[];
  /** CTA label and visual style for landing page */
  cta: { label: string; style: 'outline' | 'amber' };
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/ month',
    roiNote: null,
    badge: { label: 'Start here', color: 'var(--brand-emerald)', text: 'white' },
    highlight: false,
    features: [
      '3 customers / month',
      '1 email template',
      'Basic job dashboard',
      'Click tracking',
      'ReviewNudge branding in email footer',
    ],
    limitations: ['ReviewNudge branding in email footer'],
    cta: { label: 'Get Started Free', style: 'outline' },
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$9',
    period: '/ month',
    roiNote: 'Less than 1 missed job',
    badge: { label: 'Most Popular', color: 'var(--brand-amber)', text: 'var(--brand-navy)' },
    highlight: true,
    features: [
      '30 customers / month',
      '1 email template',
      'Basic job dashboard',
      'Click tracking',
      'No ReviewNudge branding',
    ],
    limitations: [],
    cta: { label: 'Choose Starter', style: 'amber' },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    period: '/ month',
    roiNote: 'Less than the cost of 1 lost customer',
    badge: null,
    highlight: false,
    features: [
      'Unlimited customers',
      'Custom email templates',
      'Review tracking & analytics',
      'No ReviewNudge branding',
      'Priority support',
    ],
    limitations: [],
    cta: { label: 'Choose Pro', style: 'outline' },
  },
];

/** Paid plans only — used in the upgrade modal (excludes Free). */
export const PAID_PLANS = PRICING_PLANS.filter((p) => p.id !== 'free') as Array<
  PricingPlan & { id: 'starter' | 'pro' }
>;
