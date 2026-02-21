import { Signer, Provider } from 'ethers';
import { getCampaignContract } from '../utils/getContract';

/**
 * Get the total number of approvers (contributors) in a campaign
 * @param campaignAddress - Address of the campaign contract
 * @param signerOrProvider - Signer or Provider
 * @returns Number of approvers
 */
export const getApproversCount = async (
  campaignAddress: string,
  signerOrProvider: Signer | Provider
): Promise<bigint> => {
  const campaignContract = await getCampaignContract(campaignAddress);
  return await campaignContract.approversCount();
};

