/** Show paise as INR with rupee symbol (locale aware). */
export function formatInrFromPaise(paise: number) {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(rupees);
}

/** Parse "1250" or "1250.50" typed in a form into integer paise. */
export function parseRupeesToPaise(input: string) {
  const n = Number.parseFloat(input.replace(/,/g, "").trim());
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}
