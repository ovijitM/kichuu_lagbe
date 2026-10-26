export function PanelHeader({
  eyebrow,
  title,
  description,
  status,
  actions,
  children,
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-primary">
            {eyebrow}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-2xl font-black text-ink">{title}</h1>
          {status}
        </div>
        {description && <p className="mt-1 text-xs text-muted">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

