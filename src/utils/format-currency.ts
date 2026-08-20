export const CURRENCY_CODE = "MYR";
export const CURRENCY_SYMBOL = "RM";

export function formatAmount(amount: number): string {
  const [whole, fraction] = Math.abs(amount).toFixed(2).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `${grouped}.${fraction}`;
}

export function formatCurrency(amount: number): string {
  return `${CURRENCY_SYMBOL} ${formatAmount(amount)}`;
}

export function formatSignedCurrency(amount: number): string {
  const sign = amount < 0 ? "-" : "+";

  return `${sign} ${formatCurrency(amount)}`;
}
