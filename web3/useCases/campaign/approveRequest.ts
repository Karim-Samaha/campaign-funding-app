import { Signer, Provider } from 'ethers';
import { getCampaignContract } from '../utils/getContract';

/**
 * Approve a spending request
 * @param campaignAddress - Address of the campaign contract
 * @param requestIndex - Index of the request to approve
 * @param signer - Signer (required for transactions)
 * @returns Transaction receipt
 */
export const approveRequest = async (
  campaignAddress: string,
  requestIndex: bigint,
  signer: Signer
) => {
  const campaignContract = getCampaignContract(campaignAddress, signer);
  
  const tx = await campaignContract.approveRequest(requestIndex);
  return await tx.wait();
};

