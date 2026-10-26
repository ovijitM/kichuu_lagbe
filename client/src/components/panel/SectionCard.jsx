export function SectionCard({ title, icon, actions, children, className = "" }) {
  return (
    <section className={`rounded-3xl border border-line bg-white p-4 shadow-card sm:p-6 ${className}`}>
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
          {title && (
            <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
              {icon && <span className="material-symbols-outlined text-xl text-primary">{icon}</span>}
              {title}
            </h2>
          )}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

