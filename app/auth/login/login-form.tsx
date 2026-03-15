"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { signInAction, type SignInState } from "./actions";

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
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

/**
 * Login form — client component.
 * Uses useActionState (React 19) to surface server action errors inline.
 */
export function LoginForm() {
  const [state, action] = useActionState<SignInState, FormData>(
    signInAction,
    null
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-neutral-700">
          Email
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
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="px-3 py-2 text-sm border border-neutral-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      <SubmitButton />

      <p className="text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-black font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
