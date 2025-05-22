export const SATS_PER_BTC: number = 100000000;

export const formatDollars = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
