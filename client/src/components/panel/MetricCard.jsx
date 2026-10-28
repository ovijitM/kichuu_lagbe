const TONE_CLASSES = {
  primary: "text-primary",
  secondary: "text-secondary",
  amber: "text-amber-deep",
  danger: "text-danger",
  neutral: "text-ink",
};

export function MetricCard({
  label,
  value,
  detail,
  icon,
  tone = "neutral",
  children,
}) {
  return (
    <div className="flex min-h-[112px] flex-col justify-between rounded-2xl border border-line bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between gap-2 text-xs text-muted">
        <span className="font-semibold">{label}</span>
        {icon && (
          <span className={`material-symbols-outlined text-base ${TONE_CLASSES[tone] || TONE_CLASSES.neutral}`}>
            {icon}
          </span>
        )}
      </div>
      {value && (
        <p className={`font-display text-2xl font-black tabular ${TONE_CLASSES[tone] || TONE_CLASSES.neutral}`}>
          {value}
        </p>
      )}
      {detail && <p className="mt-0.5 text-[10px] font-bold text-muted">{detail}</p>}
      {children}
    </div>
  );
}

