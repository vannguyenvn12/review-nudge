/** Presentational card displaying a single stat (big number + label). */

interface StatsCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
}

export default function StatsCard({ label, value, subtitle }: StatsCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}
