import { SATS_PER_BTC, formatDollars } from "../utils/constants";

type RawPriceData = {
  USD: number;
};

type ProcessedPriceData = {
  usdPriceFormatted: string;
  usdPriceRaw: number;
  satsPrice: number;
  satsPerDollar: string;
};

export const fetchPriceData = async (): Promise<RawPriceData> => {
  const url = "https://mempool.space/api/v1/prices";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error((error as Error).message);
    throw error;
  }
};

export const processPriceData = (
  priceData: RawPriceData
): ProcessedPriceData => {
  const usdPrice = priceData.USD;
  const satsPrice = usdPrice / SATS_PER_BTC;
  const satsPerDollar = ((1 / usdPrice) * SATS_PER_BTC).toFixed(0);

  return {
    usdPriceFormatted: formatDollars(usdPrice),
    usdPriceRaw: usdPrice,
    satsPrice: satsPrice,
    satsPerDollar: satsPerDollar,
  };
};

export const getCurrentPrice = async (): Promise<ProcessedPriceData> => {
  const priceData = await fetchPriceData();
  return processPriceData(priceData);
};
