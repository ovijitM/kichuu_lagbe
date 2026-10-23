export function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
      {label}
      {children}
    </label>
  );
}

export function SelectInput({ className = "", children, ...props }) {
  return (
    <select
      className={`rounded-control border border-line bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function TextInput({ className = "", ...props }) {
  return (
    <input
      className={`rounded-control border border-line bg-white px-3 py-2.5 text-sm font-normal outline-none ring-primary focus:border-primary focus:ring-2 ${className}`}
      {...props}
    />
  );
}
