import { ethers } from "ethers";
import { NFT_GATING_ABI, NFT_GATING_ADDRESS } from "../contracts/NFTGating";

export class NFTStakingService {
  private contract: ethers.Contract;
  private provider: ethers.Provider;

  constructor() {
    // Use public provider or get from environment
    this.provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    this.contract = new ethers.Contract(
      NFT_GATING_ADDRESS,
      NFT_GATING_ABI,
      this.provider
    );
  }

  async checkStakingRequirement(tokenId: number): Promise<boolean> {
    try {
      const meetsRequirement = await this.contract.meetsStakingRequirement(
        tokenId
      );
      return meetsRequirement;
    } catch (error) {
      console.error("Error checking staking requirement:", error);
      throw error;
    }
  }

  async getStakeInfo(tokenId: number): Promise<{
    timestamp: number;
    isStaked: boolean;
    lastActionTimestamp: number;
    remainingTime?: number;
  }> {
    try {
      const stake = await this.contract.stakes(tokenId);

      // Calculate remaining time if staked
      let remainingTime = 0;
      if (stake.isStaked) {
        const currentTime = Math.floor(Date.now() / 1000);
        const weekInSeconds = 7 * 24 * 60 * 60;
        const elapsedTime = currentTime - Number(stake.timestamp);
        remainingTime = Math.max(0, weekInSeconds - elapsedTime);
      }

      return {
        timestamp: Number(stake.timestamp),
        isStaked: stake.isStaked,
        lastActionTimestamp: Number(stake.lastActionTimestamp),
        remainingTime,
      };
    } catch (error) {
      console.error("Error getting stake info:", error);
      throw error;
    }
  }
}
