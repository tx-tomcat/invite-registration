import { useState, useEffect } from "react";
import { NFTStakingService } from "@/lib/services/nftStaking";

const stakingService = new NFTStakingService();

export function useNFTStaking(tokenId: number) {
  const [isStaked, setIsStaked] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStaking = async () => {
      try {
        setLoading(true);
        const stakeInfo = await stakingService.getStakeInfo(tokenId);
        setIsStaked(stakeInfo.isStaked);
        setRemainingTime(stakeInfo.remainingTime || 0);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error checking stake status"
        );
      } finally {
        setLoading(false);
      }
    };

    if (tokenId) {
      checkStaking();
    }
  }, [tokenId]);

  return { isStaked, remainingTime, loading, error };
}
