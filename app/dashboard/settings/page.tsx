import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/database";
import SettingsForm from "./settings-form";
import UpgradeModal from "./upgrade-modal";

type ProfilePartial = Pick<
  Profile,
  "business_name" | "google_review_url" | "delay_hours" | "subscription_tier"
>;

/** Server Component: fetch profile and render settings form with optional warning banner. */
export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Cast to any to work around the Relationships:[] constraint on the Database generic
  const { data: profile } = user
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((await (supabase.from("profiles") as any)
        .select("business_name, google_review_url, delay_hours, subscription_tier")
        .eq("id", user.id)
        .single()) as { data: ProfilePartial | null })
    : { data: null };

  const isFreeTier = !profile?.subscription_tier || profile.subscription_tier === "free";

  return (
    <div className="space-y-6">
      {/* Header row with optional Upgrade button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        {isFreeTier && (
          <UpgradeModal
            starterProductId={process.env.POLAR_STARTER_PRODUCT_ID ?? ""}
            proProductId={process.env.POLAR_PRO_PRODUCT_ID ?? ""}
          />
        )}
      </div>

      {/* Warning: no Google review URL configured */}
      {!profile?.google_review_url && (
        <div className="rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          ⚠ Set your Google review URL — emails won&apos;t send until this is configured.
        </div>
      )}

      <SettingsForm profile={profile} />
    </div>
  );
}
