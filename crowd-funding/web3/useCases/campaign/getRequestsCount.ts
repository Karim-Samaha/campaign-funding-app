import { Signer, Provider } from 'ethers';
import { getCampaignContract } from '../utils/getContract';

/**
 * Get the total number of requests in a campaign
 * @param campaignAddress - Address of the campaign contract
 * @param signerOrProvider - Signer or Provider
 * @returns Number of requests
 */
export const getRequestsCount = async (
  campaignAddress: string,
): Promise<bigint> => {
  const campaignContract = await getCampaignContract(campaignAddress);
  return await campaignContract.getRequestsCount();
};

