export const formatAmount = (value: number, isCurrency: boolean = true) => {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }

  // For numbers under 1,000, use standard commas (e.g., 850 or 2,342)
  return isCurrency
    ? `${value.toLocaleString("en-IN")}`
    : value.toLocaleString("en-IN");
};

// Alternative: If you want Indian numbering with commas everywhere (e.g., 2,34,878 instead of 234.8K):
export const formatWithCommas = (value: number, isCurrency: boolean = true) => {
  return isCurrency
    ? `₹${value.toLocaleString("en-IN")}`
    : value.toLocaleString("en-IN");
};
