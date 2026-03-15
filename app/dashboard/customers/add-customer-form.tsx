"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createCustomerAction } from "./actions";

/** Submit button — shows "Adding…" while the action is in flight. */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
    >
      {pending ? "Adding…" : "Add Customer"}
    </button>
  );
}

/**
 * Client form for adding a new customer.
 * Uses React 19 useActionState + useFormStatus for pending/error handling.
 * Resets via `key` prop increment on success.
 */
export default function AddCustomerForm() {
  const [state, action, pending] = useActionState(createCustomerAction, null);

  // Track a key to reset the form inputs after a successful submit
  const formKey = pending ? "pending" : state === null ? "reset" : "error";

  return (
    <form
      key={formKey}
      action={action}
      className="rounded-lg border border-gray-200 bg-white p-4"
    >
      <h2 className="mb-4 text-sm font-semibold text-gray-700">Add Customer</h2>

      <div className="flex flex-wrap gap-3">
        {/* Name — required */}
        <div className="flex min-w-[180px] flex-1 flex-col gap-1">
          <label htmlFor="name" className="text-xs font-medium text-gray-600">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Jane Smith"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Email */}
        <div className="flex min-w-[180px] flex-1 flex-col gap-1">
          <label htmlFor="email" className="text-xs font-medium text-gray-600">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Phone */}
        <div className="flex min-w-[140px] flex-1 flex-col gap-1">
          <label htmlFor="phone" className="text-xs font-medium text-gray-600">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 555 000 0000"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>

      {/* Error message */}
      {state?.error && (
        <p className="mt-3 text-sm text-red-600">{state.error}</p>
      )}

      <div className="mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
