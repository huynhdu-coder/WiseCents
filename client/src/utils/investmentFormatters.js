export function formatCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value, digits = 2) {
  return Number(value || 0).toFixed(digits);
}

export function formatPercent(value) {
  const amount = Number(value || 0);
  return `${amount >= 0 ? "+" : ""}${amount.toFixed(2)}%`;
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}