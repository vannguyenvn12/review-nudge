"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateSettingsAction } from "./actions";
import type { Profile } from "@/lib/types/database";

type ProfilePartial = Pick<Profile, "business_name" | "google_review_url" | "delay_hours">;

/** Submit button — shows "Saving…" while the action is in flight. */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save Settings"}
    </button>
  );
}

interface SettingsFormProps {
  profile: ProfilePartial | null;
}

/**
 * Client form for updating business settings.
 * Pre-populated with current profile values.
 * Uses React 19 useActionState + useFormStatus for pending/success/error feedback.
 */
export default function SettingsForm({ profile }: SettingsFormProps) {
  const [state, action] = useActionState(updateSettingsAction, null);

  return (
    <form action={action} className="space-y-5 rounded-lg border border-gray-200 bg-white p-6">
      {/* Business Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="business_name" className="text-xs font-medium text-gray-600">
          Business Name
        </label>
        <input
          id="business_name"
          name="business_name"
          type="text"
          defaultValue={profile?.business_name ?? ""}
          placeholder="Acme Services"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      {/* Google Review URL */}
      <div className="flex flex-col gap-1">
        <label htmlFor="google_review_url" className="text-xs font-medium text-gray-600">
          Google Review URL
        </label>
        <input
          id="google_review_url"
          name="google_review_url"
          type="url"
          defaultValue={profile?.google_review_url ?? ""}
          placeholder="https://g.page/r/..."
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      {/* Delay Hours */}
      <div className="flex flex-col gap-1">
        <label htmlFor="delay_hours" className="text-xs font-medium text-gray-600">
          Review Request Delay (hours)
        </label>
        <input
          id="delay_hours"
          name="delay_hours"
          type="number"
          min={0}
          step={0.5}
          defaultValue={profile?.delay_hours ?? 2}
          className="w-32 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <p className="text-xs text-gray-400">
          How long after a job is logged before the review email is sent.
        </p>
      </div>

      {/* Feedback messages */}
      {"success" in (state ?? {}) && (
        <p className="text-sm font-medium text-green-600">Settings saved.</p>
      )}
      {"error" in (state ?? {}) && (
        <p className="text-sm text-red-600">{(state as { error: string }).error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
