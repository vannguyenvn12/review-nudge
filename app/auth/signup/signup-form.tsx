"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { signUpAction, type SignUpState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 px-4 bg-black text-white rounded-lg font-medium text-sm
                 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors"
    >
      {pending ? "Creating account…" : "Create account"}
    </button>
  );
}

/**
 * Signup form — client component.
 * Required: email, password. Optional: full_name, business_name, google_review_url, delay_hours.
 */
export function SignupForm() {
  const [state, action] = useActionState<SignUpState, FormData>(
    signUpAction,
    null
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      {/* Error banner */}
      {"error" in (state ?? {}) && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {(state as { error: string }).error}
        </p>
      )}

      {/* Success / email-confirmation banner */}
      {"message" in (state ?? {}) && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          {(state as { message: string }).message}
        </p>
      )}

      {/* ── Required fields ── */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-neutral-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="px-3 py-2 text-sm border border-neutral-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-neutral-700">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          className="px-3 py-2 text-sm border border-neutral-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      {/* ── Optional fields ── */}
      <div className="border-t border-neutral-100 pt-4 flex flex-col gap-4">
        <p className="text-xs text-neutral-400 -mb-1">Optional — you can fill these in later</p>

        <div className="flex flex-col gap-1">
          <label htmlFor="full_name" className="text-sm font-medium text-neutral-700">
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            className="px-3 py-2 text-sm border border-neutral-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="business_name" className="text-sm font-medium text-neutral-700">
            Business name
          </label>
          <input
            id="business_name"
            name="business_name"
            type="text"
            placeholder="Acme Plumbing Co."
            className="px-3 py-2 text-sm border border-neutral-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="google_review_url" className="text-sm font-medium text-neutral-700">
            Google review URL
          </label>
          <input
            id="google_review_url"
            name="google_review_url"
            type="url"
            placeholder="https://g.page/r/..."
            className="px-3 py-2 text-sm border border-neutral-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="delay_hours" className="text-sm font-medium text-neutral-700">
            Review request delay (hours)
          </label>
          <input
            id="delay_hours"
            name="delay_hours"
            type="number"
            min="1"
            placeholder="2"
            className="px-3 py-2 text-sm border border-neutral-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <p className="text-xs text-neutral-400">
            How many hours after a job to send the review request (default: 2)
          </p>
        </div>
      </div>

      <SubmitButton />

      <p className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-black font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
