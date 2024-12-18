import { useNFTStaking } from "@/hooks/useNFTStaking";

export function StakingStatus({ tokenId }: { tokenId: number }) {
  const { isStaked, remainingTime, loading, error } = useNFTStaking(tokenId);

  if (loading) {
    return <div>Checking staking status...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Staking Status</h3>
      {isStaked ? (
        <div>
          <p>NFT is staked</p>
          {remainingTime > 0 ? (
            <p>
              Time remaining: {Math.ceil(remainingTime / (24 * 60 * 60))} days
            </p>
          ) : (
            <p>Staking requirement met!</p>
          )}
        </div>
      ) : (
        <p>NFT is not staked</p>
      )}
    </div>
  );
}
