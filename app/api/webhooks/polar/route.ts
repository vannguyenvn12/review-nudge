import { Webhooks } from "@polar-sh/nextjs";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * POST /api/webhooks/polar
 * Handles Polar.sh webhook events to keep subscription state in sync with Supabase.
 * Signature is validated by the Webhooks helper via POLAR_WEBHOOK_SECRET.
 */
export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  onPayload: async (payload) => {
    const { type, data } = payload as {
      type: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: Record<string, any>;
    };

    // Only process subscription-related events
    if (!type.startsWith("subscription.")) return;

    const supabase = createAdminClient();

    // userId is stored in checkout metadata and forwarded to the subscription object
    const userId: string | undefined =
      data?.metadata?.userId ?? data?.checkout?.metadata?.userId;

    if (!userId) {
      console.warn("[polar-webhook] No userId in metadata for event:", type);
      return;
    }

    // Determine tier from product ID
    const productId: string | undefined = data?.product?.id ?? data?.productId;
    let tier = "free";
    if (productId === process.env.POLAR_STARTER_PRODUCT_ID) tier = "starter";
    else if (productId === process.env.POLAR_PRO_PRODUCT_ID) tier = "pro";

    // Determine status
    const polarStatus: string = data?.status ?? "";
    const isCanceled =
      type === "subscription.revoked" ||
      type === "subscription.canceled" ||
      polarStatus === "canceled" ||
      polarStatus === "revoked";

    const updates: Record<string, string | null> = {
      polar_subscription_id: data?.id ?? null,
      polar_customer_id: data?.customerId ?? null,
      subscription_current_period_end: data?.currentPeriodEnd ?? null,
    };

    if (isCanceled) {
      // Downgrade back to free on cancellation
      updates.subscription_tier = "free";
      updates.subscription_status = "canceled";
    } else {
      updates.subscription_tier = tier;
      updates.subscription_status = "active";
    }

    // Cast to any to work around the Relationships:[] constraint on the Database generic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("profiles") as any)
      .update(updates)
      .eq("id", userId);

    if (error) {
      console.error("[polar-webhook] Failed to update profile:", error.message);
    } else {
      console.log(`[polar-webhook] ${type} → user ${userId} → tier=${updates.subscription_tier}`);
    }
  },
});
