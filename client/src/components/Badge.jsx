export function Badge({ tone = "mint", children }) {
  const tones = {
    mint: "bg-mint text-primary",
    amber: "bg-amber-soft text-amber-deep",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
}
