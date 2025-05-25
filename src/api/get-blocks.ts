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
  reward: number;
  rewardUSD: string;
  fees: number;
  feesUSD: string;
  avgFee: number;
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
    reward: block.extras.reward,
    rewardUSD: formatDollars(block.extras.reward * priceData.satsPrice),
    fees: block.extras.totalFees,
    feesUSD: formatDollars(block.extras.totalFees * priceData.satsPrice),
    avgFee: block.extras.avgFee,
    poolName: block.extras.pool.name,
  }));

  return processedBlocks;
};
