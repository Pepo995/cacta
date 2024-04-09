export const round = (amount: number, decimals = 1, truncate = false) =>
  (Math.abs(amount) < 1000000 && Math.abs(amount) >= 1) || amount === 0
    ? amount.toLocaleString("en", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : truncate
    ? "< 1.0"
    : amount.toExponential(2);
