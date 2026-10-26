export function PanelTabs({ items, value, onChange, className = "" }) {
  return (
    <div className={`flex max-w-full gap-1 overflow-x-auto rounded-xl border border-line bg-surface-low p-1 text-xs font-bold scrollbar-none ${className}`}>
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              active ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            {item.icon && <span className="material-symbols-outlined text-sm">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

