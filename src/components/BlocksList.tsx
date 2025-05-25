import { processBlocks } from "@/api/get-blocks";
import { Button } from "@/components/ui/button"; // Import the Button component

type Block = Awaited<ReturnType<typeof processBlocks>>[number];
type Props = {
  blocks: Block[];
  loading: boolean;
  error: string | null;
  preview?: boolean;
  displaySats?: boolean;
};

export function BlocksList({
  blocks,
  loading,
  error,
  preview = false,
  displaySats = false,
}: Props) {
  if (loading) return <div>Loading blocks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul className="space-y-2">
      {blocks.map((block) => (
        <li key={block.height} className="border p-2 rounded relative">
          {" "}
          {/* Make li relative */}
          <div className="flex justify-between items-start">
            {" "}
            {/* Flex container for content and button */}
            <div>
              <div>
                <strong>Height:</strong> {block.height}
              </div>
              <div>
                <strong>Time:</strong> {block.timestamp}
              </div>
              <div>
                <strong>Reward:</strong>{" "}
                {displaySats ? block.reward : block.rewardUSD}
              </div>
              {!preview && (
                <>
                  <div className="ml-4">
                    <p>
                      <strong>Subsidy: </strong>
                      {displaySats ? block.subsidy : block.subsidyUSD}
                    </p>
                    <p>
                      <strong>Fees: </strong>
                      {displaySats ? block.fees : block.feesUSD}
                    </p>
                    <p>
                      <strong>Avg Fee:</strong>{" "}
                      {displaySats ? block.avgFee : block.avgFeeUSD}
                    </p>
                  </div>
                  <div>
                    <strong>Pool:</strong> {block.poolName}
                  </div>
                  <div>
                    <strong>Tx Count:</strong> {block.txCount}
                  </div>
                  <div>
                    <strong>Difficulty:</strong> {block.difficulty}
                  </div>
                  <div>
                    <strong>ID:</strong> {block.id}
                  </div>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2" // Position the button
              onClick={() =>
                window.open(`https://mempool.space/block/${block.id}`)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 128 128"
              >
                <path d="M 84 11 C 82.3 11 81 12.3 81 14 C 81 15.7 82.3 17 84 17 L 106.80078 17 L 60.400391 63.400391 C 59.200391 64.600391 59.200391 66.499609 60.400391 67.599609 C 61.000391 68.199609 61.8 68.5 62.5 68.5 C 63.2 68.5 63.999609 68.199609 64.599609 67.599609 L 111 21.199219 L 111 44 C 111 45.7 112.3 47 114 47 C 115.7 47 117 45.7 117 44 L 117 14 C 117 12.3 115.7 11 114 11 L 84 11 z M 24 31 C 16.8 31 11 36.8 11 44 L 11 104 C 11 111.2 16.8 117 24 117 L 84 117 C 91.2 117 97 111.2 97 104 L 97 59 C 97 57.3 95.7 56 94 56 C 92.3 56 91 57.3 91 59 L 91 104 C 91 107.9 87.9 111 84 111 L 24 111 C 20.1 111 17 107.9 17 104 L 17 44 C 17 40.1 20.1 37 24 37 L 69 37 C 70.7 37 72 35.7 72 34 C 72 32.3 70.7 31 69 31 L 24 31 z"></path>
              </svg>
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
