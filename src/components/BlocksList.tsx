import { processBlocks } from "@/api/get-blocks";

type Block = Awaited<ReturnType<typeof processBlocks>>[number];
type Props = {
  blocks: Block[];
  loading: boolean;
  error: string | null;
};

export function BlocksList({ blocks, loading, error }: Props) {
  if (loading) return <div>Loading blocks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul className="space-y-2">
      {blocks.map((block) => (
        <li key={block.height} className="border p-2 rounded">
          <div>Height: {block.height}</div>
          <div>Tx Count: {block.txCount}</div>
          <div>Reward: {block.rewardUSD}</div>
          <div>Pool: {block.poolName}</div>
          <div>Time: {block.timestamp}</div>
        </li>
      ))}
    </ul>
  );
}
