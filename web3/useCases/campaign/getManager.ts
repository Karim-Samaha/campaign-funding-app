import { Signer, Provider } from 'ethers';
import { getCampaignContract } from '../utils/getContract';

/**
 * Get the manager address of a campaign
 * @param campaignAddress - Address of the campaign contract
 * @param signerOrProvider - Signer or Provider
 * @returns Manager address
 */
export const getManager = async (
  campaignAddress: string,
  signerOrProvider: Signer | Provider
): Promise<string> => {
  const campaignContract = getCampaignContract(campaignAddress, signerOrProvider);
  return await campaignContract.manger();
};

