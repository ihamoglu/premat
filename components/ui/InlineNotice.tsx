type InlineNoticeProps = {
  tone?: "info" | "success" | "error" | "warning";
  title?: string;
  children: React.ReactNode;
};

const toneMap: Record<NonNullable<InlineNoticeProps["tone"]>, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
};

export default function InlineNotice({
  tone = "info",
  title,
  children,
}: InlineNoticeProps) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${toneMap[tone]}`}>
      {title ? <div className="font-semibold">{title}</div> : null}
      <div className={title ? "mt-1 leading-7" : "leading-7"}>{children}</div>
    </div>
  );
}
