"use client";

interface CustomerSelectProps {
  /** List of customers to populate the dropdown. */
  customers: { id: string; name: string }[];
  /** HTML name attribute for form submission. */
  name: string;
}

/**
 * Controlled customer dropdown for the log-job form.
 * Split into its own file to keep log-job-form under 200 lines.
 */
export default function CustomerSelect({ customers, name }: CustomerSelectProps) {
  return (
    <select
      id="customer_id"
      name={name}
      required
      defaultValue=""
      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
    >
      <option value="" disabled>
        Select a customer…
      </option>
      {customers.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
