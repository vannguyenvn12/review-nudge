import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/database";
import Link from "next/link";

type BillingProfile = Pick<
  Profile,
  "subscription_tier" | "subscription_status" | "subscription_current_period_end"
>;

const TIER_LABELS: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
};

const TIER_COLORS: Record<string, string> = {
  free: "bg-gray-100 text-gray-700",
  starter: "bg-blue-100 text-blue-700",
  pro: "bg-indigo-100 text-indigo-700",
};

/** Format ISO timestamptz to a readable local date string. */
function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface BillingPageProps {
  searchParams: Promise<{ success?: string }>;
}

/**
 * Server Component — /dashboard/billing
 * Shows the user's current subscription plan, status, and renewal date.
 * Displays a success banner when redirected from Polar checkout (?success=true).
 */
export default async function BillingPage({ searchParams }: BillingPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((await (supabase.from("profiles") as any)
        .select("subscription_tier, subscription_status, subscription_current_period_end")
        .eq("id", user.id)
        .single()) as { data: BillingProfile | null })
    : { data: null };

  const { success } = await searchParams;
  const showSuccess = success === "true";

  const tier = profile?.subscription_tier ?? "free";
  const status = profile?.subscription_status ?? "active";
  const periodEnd = profile?.subscription_current_period_end ?? null;
  const isFree = tier === "free";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Billing</h1>

      {/* Success banner after checkout redirect */}
      {showSuccess && (
        <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          🎉 Subscription activated! Welcome to the {TIER_LABELS[tier] ?? tier} plan.
        </div>
      )}

      {/* Subscription card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Current Plan
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tier badge */}
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${TIER_COLORS[tier] ?? TIER_COLORS.free}`}
          >
            {TIER_LABELS[tier] ?? tier}
          </span>

          {/* Status badge */}
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        {/* Renewal date — only relevant for paid plans */}
        {!isFree && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Renews on:</span>{" "}
            <span>{formatDate(periodEnd)}</span>
          </div>
        )}

        {/* Divider */}
        <hr className="border-gray-100" />

        {/* CTA */}
        {isFree ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Upgrade to unlock more review requests and features.
            </p>
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              Upgrade plan
            </Link>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            To manage or cancel your subscription, visit{" "}
            <a
              href="https://polar.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 hover:underline"
            >
              polar.sh
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
