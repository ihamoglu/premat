type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  actions?: React.ReactNode;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  actions,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-4 ${
        centered
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between"
      }`}
    >
      <div className={centered ? "max-w-3xl" : "max-w-3xl"}>
        {eyebrow ? (
          <div className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-blue-800">
            {eyebrow}
          </div>
        ) : null}

        <h2 className="mt-4 text-xl font-black tracking-[-0.03em] text-slate-950 sm:text-2xl md:text-3xl">
          {title}
        </h2>

        {description ? (
          <p className="mt-2 text-sm leading-7 text-slate-600 md:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
