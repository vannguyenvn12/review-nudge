"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionState = { success: true } | { error: string } | null;

/** Update business_name, google_review_url, and delay_hours for the current user's profile. */
export async function updateSettingsAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Not authenticated." };

    const business_name = (formData.get("business_name") as string)?.trim() || null;
    const google_review_url = (formData.get("google_review_url") as string)?.trim() || null;
    const delay_hours = parseFloat(formData.get("delay_hours") as string);

    if (isNaN(delay_hours) || delay_hours < 0) {
      return { error: "Delay hours must be 0 or greater." };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("profiles") as any)
      .update({ business_name, google_review_url, delay_hours })
      .eq("id", user.id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch {
    return { error: "Unexpected error. Please try again." };
  }
}
