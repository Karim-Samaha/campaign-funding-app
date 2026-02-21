import { Signer, Provider } from 'ethers';
import { getCampaignContract } from '../utils/getContract';

/**
 * Check if an address is an approver (contributor) in the campaign
 * @param campaignAddress - Address of the campaign contract
 * @param address - Address to check
 * @param signerOrProvider - Signer or Provider
 * @returns True if the address is an approver, false otherwise
 */
export const getApprovers = async (
  campaignAddress: string,
  address: string,
  signerOrProvider: Signer | Provider
): Promise<boolean> => {
  const campaignContract = await getCampaignContract(campaignAddress);
  return await campaignContract.approvers(address);
};

