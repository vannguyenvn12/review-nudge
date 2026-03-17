"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CUSTOMER_TIER_LIMITS } from "@/lib/config/pricing-plans";
import type { PlanId } from "@/lib/config/pricing-plans";

export type CreateCustomerState = { error: string } | null;

/**
 * Server Action: insert a new customer row for the authenticated user.
 * Returns null on success, { error } on failure.
 *
 * Enforces per-billing-period customer limits based on subscription_tier:
 *   free → 3, starter → 30, pro → unlimited
 *
 * Note: `as any` cast mirrors the signup action pattern — the Database generic
 * resolves Insert to `never` due to Relationships typing; this is a known
 * postgrest-js constraint with manual Database types.
 */
export async function createCustomerAction(
  _prev: CreateCustomerState,
  formData: FormData
): Promise<CreateCustomerState> {
  const name = (formData.get("name") as string | null)?.trim();
  const email = (formData.get("email") as string | null)?.trim() || null;
  const phone = (formData.get("phone") as string | null)?.trim() || null;

  if (!name) return { error: "Customer name is required." };

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  // --- Tier limit enforcement ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase.from("profiles") as any)
    .select("subscription_tier, subscription_current_period_end")
    .eq("id", user.id)
    .single() as {
      data: {
        subscription_tier: PlanId;
        subscription_current_period_end: string | null;
      } | null;
    };

  const tier: PlanId = profile?.subscription_tier ?? "free";
  const limit = CUSTOMER_TIER_LIMITS[tier];

  // Pro tier has no limit — skip the count query entirely
  if (limit !== Infinity) {
    // Compute period start for customer count:
    //   - free tier always uses calendar month start (no billing cycle)
    //   - paid tiers use subscription_current_period_end minus 1 month
    let periodStart: Date;
    if (tier === "free") {
      periodStart = new Date();
      periodStart.setDate(1);
      periodStart.setHours(0, 0, 0, 0);
    } else {
      // Paid tier: derive start from billing cycle end
      periodStart = profile?.subscription_current_period_end
        ? new Date(new Date(profile.subscription_current_period_end).setMonth(
            new Date(profile.subscription_current_period_end).getMonth() - 1
          ))
        : (() => { const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d; })();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count } = await (supabase.from("customers") as any)
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", periodStart.toISOString()) as { count: number | null };

    if ((count ?? 0) >= limit) {
      const planName = tier.charAt(0).toUpperCase() + tier.slice(1);
      return {
        error: `You've reached the ${limit}-customer limit on the ${planName} plan. Upgrade to add more.`,
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("customers") as any).insert({
    user_id: user.id,
    name,
    email,
    phone,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/customers");
  return null;
}

