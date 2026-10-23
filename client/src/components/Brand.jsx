export function Brand({
  compact = false,
  dark = false,
  size = "md",
  subtitle = "Crave more! Till four",
}) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <div className="flex items-center gap-2.5 group select-none">
      {/* Stylized Typographic Monogram Emblem */}
      <div
        className={`flex items-center justify-center font-display font-black tracking-tighter shadow-sm transition-transform group-hover:scale-105 ${
          isSm
            ? "h-7 w-7 rounded-lg text-xs"
            : isLg
            ? "h-11 w-11 rounded-2xl text-base"
            : "h-9 w-9 rounded-xl text-sm"
        } ${
          dark
            ? "bg-secondary-fixed text-slate-950 font-black shadow-secondary-fixed/20"
            : "bg-primary-deep text-white shadow-primary-deep/20"
        }`}
      >
        <span>
          K
          <span
            className={`font-black ${
              dark ? "text-primary-dark" : "text-secondary-fixed"
            }`}
          >
            ?
          </span>
        </span>
      </div>

      {!compact && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1 font-display leading-none">
            <span
              className={`font-black tracking-tight ${
                isSm ? "text-sm" : isLg ? "text-xl" : "text-base"
              } ${dark ? "text-white" : "text-ink"}`}
            >
              KICHUU
            </span>
            <span
              className={`font-black tracking-tight text-primary ${
                isSm ? "text-sm" : isLg ? "text-xl" : "text-base"
              }`}
            >
              LAGBE
            </span>
            <span
              className={`font-black text-amber leading-none ${
                isSm ? "text-sm" : isLg ? "text-xl" : "text-base"
              }`}
            >
              ?
            </span>
          </div>
          {subtitle && (
            <span
              className={`mt-0.5 font-extrabold uppercase tracking-widest ${
                isSm
                  ? "text-[8px]"
                  : isLg
                  ? "text-[10px]"
                  : "text-[9px]"
              } ${dark ? "text-secondary-fixed/90" : "text-secondary"}`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

