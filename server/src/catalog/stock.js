export const LOW_STOCK_AT = 5;

export function stockLevel(stock) {
  if (stock <= 0) return "out";
  if (stock <= LOW_STOCK_AT) return "low";
  return "in";
}

export function stockForLevel(level, current) {
  if (level === "out") return 0;
  if (level === "low") return current > 0 && current <= LOW_STOCK_AT ? current : LOW_STOCK_AT;
  return current > LOW_STOCK_AT ? current : 12;
}
