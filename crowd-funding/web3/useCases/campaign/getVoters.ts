import { Signer, Provider } from 'ethers';
import { getCampaignContract } from '../utils/getContract';

/**
 * Check if an address has voted on a specific request
 * @param campaignAddress - Address of the campaign contract
 * @param requestIndex - Index of the request
 * @param address - Address to check
 * @param signerOrProvider - Signer or Provider
 * @returns True if the address has voted, false otherwise
 */
export const getVoters = async (
  campaignAddress: string,
  requestIndex: bigint,
  address: string,
): Promise<boolean> => {
  const campaignContract = await getCampaignContract(campaignAddress);
  return await campaignContract.voters(requestIndex, address);
};

