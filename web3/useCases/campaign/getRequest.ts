import { Signer, Provider } from 'ethers';
import { getCampaignContract } from '../utils/getContract';
import { Request } from '../types';

/**
 * Get a specific request by index
 * @param campaignAddress - Address of the campaign contract
 * @param requestIndex - Index of the request
 * @param signerOrProvider - Signer or Provider
 * @returns Request object
 */
export const getRequest = async (
  campaignAddress: string,
  requestIndex: bigint,
  signerOrProvider: Signer | Provider
): Promise<Request> => {
  const campaignContract = getCampaignContract(campaignAddress, signerOrProvider);
  
  const [description, value, recipient, completed, votersCount] = 
    await campaignContract.requests(requestIndex);
  
  return {
    description,
    value,
    recipient,
    completed,
    votersCount,
  };
};

