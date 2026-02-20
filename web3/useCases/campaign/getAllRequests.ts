import { Signer, Provider } from 'ethers';
import { getRequestsCount } from './getRequestsCount';
import { getRequest } from './getRequest';
import { Request } from '../types';

/**
 * Get all requests for a campaign
 * @param campaignAddress - Address of the campaign contract
 * @param signerOrProvider - Signer or Provider
 * @returns Array of all requests
 */
export const getAllRequests = async (
  campaignAddress: string,
  signerOrProvider: Signer | Provider
): Promise<Request[]> => {
  const count = await getRequestsCount(campaignAddress, signerOrProvider);
  const requests: Request[] = [];
  
  for (let i = 0; i < Number(count); i++) {
    const request = await getRequest(campaignAddress, BigInt(i), signerOrProvider);
    requests.push(request);
  }
  
  return requests;
};

