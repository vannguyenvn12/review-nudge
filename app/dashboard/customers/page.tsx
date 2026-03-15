import { createClient } from "@/lib/supabase/server";
import type { Customer } from "@/lib/types/database";
import EmptyState from "@/app/dashboard/components/empty-state";
import AddCustomerForm from "./add-customer-form";

/** Server Component: fetch all customers and render list + add form. */
export default async function CustomersPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("customers")
    .select("id, name, email, phone")
    .order("name");

  const customers = (data ?? []) as Pick<Customer, "id" | "name" | "email" | "phone">[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Customers</h1>

      <AddCustomerForm />

      {customers.length === 0 ? (
        <EmptyState message="No customers yet — add your first one above." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Email", "Phone"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600">{c.email ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{c.phone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
