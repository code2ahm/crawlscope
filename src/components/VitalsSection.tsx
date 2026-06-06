import { vitalStatusClasses, vitalStatusLabel } from "@/lib/utils";
import type { CoreWebVitals } from "@/types/audit";

interface Props {
  vitals: CoreWebVitals;
}

export function VitalsSection({ vitals }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {Object.entries(vitals).map(([key, data]) => (
        <VitalCard key={key} metric={key.toUpperCase()} data={data} />
      ))}
    </div>
  );
}

function VitalCard({
  metric,
  data,
}: {
  metric: string;
  data: CoreWebVitals[keyof CoreWebVitals];
}) {
  const statusClasses = vitalStatusClasses(data.status);
  const statusLabel = vitalStatusLabel(data.status);

  const statusBorderColor = {
    good: "#22c55e",
    "needs-improvement": "#f59e0b",
    poor: "#ef4444",
  }[data.status];

  const valueColor = {
    good: "#16a34a",
    "needs-improvement": "#d97706",
    poor: "#dc2626",
  }[data.status];

  return (
    <div
      className="bg-white rounded-2xl p-4 border"
      style={{ borderColor: statusBorderColor + "30" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
            {metric}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
            {data.label}
          </p>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-lg ${statusClasses} whitespace-nowrap`}
        >
          {statusLabel}
        </span>
      </div>

      <p
        className="text-3xl font-black leading-none mb-1"
        style={{ color: valueColor }}
      >
        {data.value}
        <span className="text-base font-medium ml-0.5 opacity-60">
          {data.unit}
        </span>
      </p>

      <div className="flex gap-3 mt-3 mb-3">
        <div className="text-[10px] text-slate-400">
          <span className="text-green-600 font-semibold">Good</span>{" "}
          {data.threshold.good}
        </div>
        <div className="text-[10px] text-slate-400">
          <span className="text-red-500 font-semibold">Poor</span>{" "}
          {data.threshold.poor}
        </div>
      </div>

      <p className="text-[11.5px] text-slate-500 leading-relaxed border-t border-slate-100 pt-3 mt-2">
        {data.recommendation}
      </p>
    </div>
  );
}
