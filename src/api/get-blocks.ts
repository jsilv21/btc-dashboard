import { getCurrentPrice } from "./price-metrics";
import { formatDollars } from "../utils/constants";

type BlockExtras = {
  reward: number;
  totalFees: number;
  avgFee: number;
  pool: {
    name: string;
  };
};
type Block = {
  id: string;
  height: number;
  difficulty: number;
  tx_count: number;
  timestamp: number;
  extras: BlockExtras;
};

type PriceData = {
  satsPrice: number;
};

type ProcessedBlock = {
  id: string;
  height: number;
  difficulty: number;
  txCount: number;
  timestamp: string;
  reward: string;
  rewardUSD: string;
  fees: string;
  feesUSD: string;
  subsidy: string;
  subsidyUSD: string;
  avgFee: string;
  avgFeeUSD: string;
  poolName: string;
};

// fetch blocks from mempool.space
export const fetchBlocks = async (): Promise<Block[]> => {
  const url = "https://mempool.space/api/v1/blocks";
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

// process blocks and add price data
export const processBlocks = async (): Promise<ProcessedBlock[]> => {
  const [blocks, priceData]: [Block[], PriceData] = await Promise.all([
    fetchBlocks(),
    getCurrentPrice(),
  ]);
  const processedBlocks = blocks.map((block) => ({
    id: block.id,
    height: block.height,
    difficulty: block.difficulty,
    txCount: block.tx_count,
    timestamp: new Date(block.timestamp * 1000).toLocaleString(),
    reward: block.extras.reward.toLocaleString(),
    rewardUSD: formatDollars(block.extras.reward * priceData.satsPrice),
    fees: block.extras.totalFees.toLocaleString(),
    feesUSD: formatDollars(block.extras.totalFees * priceData.satsPrice),
    subsidy: (block.extras.reward - block.extras.totalFees).toLocaleString(),
    subsidyUSD: formatDollars(
      (block.extras.reward - block.extras.totalFees) * priceData.satsPrice
    ),
    avgFee: block.extras.avgFee.toLocaleString(),
    avgFeeUSD: formatDollars(block.extras.avgFee * priceData.satsPrice),
    poolName: block.extras.pool.name,
  }));

  return processedBlocks;
};
