"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { logJobAction } from "./actions";
import CustomerSelect from "./customer-select";

interface LogJobFormProps {
  customers: { id: string; name: string }[];
}

/** Submit button — shows "Logging…" while action is in flight. */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
    >
      {pending ? "Logging…" : "Log Job"}
    </button>
  );
}

/**
 * Client form for logging a completed job.
 * Passes customers list to CustomerSelect for the dropdown.
 * Resets via key increment on successful submit.
 */
export default function LogJobForm({ customers }: LogJobFormProps) {
  const [state, action, pending] = useActionState(logJobAction, null);

  // Reset form fields after a successful submit
  const formKey = pending ? "pending" : state === null ? "reset" : "error";

  // Default completed_at to current local datetime-local value
  const nowLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <form
      key={formKey}
      action={action}
      className="rounded-lg border border-gray-200 bg-white p-4"
    >
      <h2 className="mb-4 text-sm font-semibold text-gray-700">Log Completed Job</h2>

      <div className="flex flex-wrap gap-3">
        {/* Customer dropdown */}
        <div className="flex min-w-[180px] flex-1 flex-col gap-1">
          <label htmlFor="customer_id" className="text-xs font-medium text-gray-600">
            Customer <span className="text-red-500">*</span>
          </label>
          <CustomerSelect customers={customers} name="customer_id" />
        </div>

        {/* Service type */}
        <div className="flex min-w-[180px] flex-1 flex-col gap-1">
          <label htmlFor="service_type" className="text-xs font-medium text-gray-600">
            Service Type <span className="text-red-500">*</span>
          </label>
          <input
            id="service_type"
            name="service_type"
            type="text"
            required
            placeholder="e.g. Roof repair"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Completed at */}
        <div className="flex min-w-[200px] flex-1 flex-col gap-1">
          <label htmlFor="completed_at" className="text-xs font-medium text-gray-600">
            Completed At
          </label>
          <input
            id="completed_at"
            name="completed_at"
            type="datetime-local"
            defaultValue={nowLocal}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Notes */}
        <div className="flex w-full flex-col gap-1">
          <label htmlFor="notes" className="text-xs font-medium text-gray-600">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            placeholder="Optional job notes…"
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
