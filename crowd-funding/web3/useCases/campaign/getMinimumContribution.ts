import { Signer, Provider } from 'ethers';
import { getCampaignContract } from '../utils/getContract';

/**
 * Get the minimum contribution amount for a campaign
 * @param campaignAddress - Address of the campaign contract
 * @param signerOrProvider - Signer or Provider
 * @returns Minimum contribution amount in wei
 */
export const getMinimumContribution = async (
  campaignAddress: string,
  signerOrProvider: Signer | Provider
): Promise<bigint> => {
  const campaignContract = getCampaignContract(campaignAddress, signerOrProvider);
  return await campaignContract.minumumContribution();
};

