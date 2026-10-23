import { Link } from "react-router-dom";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary: "border border-slate-300 bg-white text-ink hover:bg-mint hover:text-primary",
  danger: "bg-danger text-white hover:bg-red-600",
};

export function Button({ to, variant = "primary", className = "", type = "button", ...props }) {
  const classes = `inline-flex items-center justify-center rounded-control px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`;
  if (to) return <Link to={to} className={classes} {...props} />;
  return <button type={type} className={classes} {...props} />;
}
