"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CreateCustomerState = { error: string } | null;

/**
 * Server Action: insert a new customer row for the authenticated user.
 * Returns null on success, { error } on failure.
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
