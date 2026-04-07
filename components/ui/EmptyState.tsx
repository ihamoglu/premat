type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-[1.9rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm sm:p-12">
      <div className="mx-auto max-w-xl">
        <h3 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
          {description}
        </p>
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </div>
  );
}
