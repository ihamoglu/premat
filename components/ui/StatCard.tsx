type StatCardProps = {
  label: string;
  value: string | number;
  tone?: "default" | "blue" | "emerald" | "amber" | "red" | "white";
};

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "border border-slate-200 bg-white shadow-sm",
  blue: "border border-blue-100 bg-blue-50",
  emerald: "border border-emerald-200 bg-emerald-50",
  amber: "border border-amber-200 bg-amber-50",
  red: "border border-red-200 bg-red-50",
  white: "border border-white/40 bg-white/95 shadow-lg shadow-slate-900/10",
};

const valueClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-slate-950",
  blue: "text-blue-900",
  emerald: "text-emerald-700",
  amber: "text-amber-700",
  red: "text-red-700",
  white: "text-slate-950",
};

export default function StatCard({
  label,
  value,
  tone = "default",
}: StatCardProps) {
  return (
    <div
      className={`rounded-[1.45rem] p-5 ${toneClasses[tone]}`}
    >
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div
        className={`mt-2 text-3xl font-black tracking-[-0.03em] ${valueClasses[tone]}`}
      >
        {value}
      </div>
    </div>
  );
}
