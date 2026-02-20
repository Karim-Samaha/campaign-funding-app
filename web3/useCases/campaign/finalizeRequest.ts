import { Signer, Provider } from 'ethers';
import { getCampaignContract } from '../utils/getContract';

/**
 * Finalize a spending request (only manager can call this)
 * This will execute the payment if the request has enough approvals
 * @param campaignAddress - Address of the campaign contract
 * @param requestIndex - Index of the request to finalize
 * @param signer - Signer (required for transactions)
 * @returns Transaction receipt
 */
export const finalizeRequest = async (
  campaignAddress: string,
  requestIndex: bigint,
  signer: Signer
) => {
  const campaignContract = getCampaignContract(campaignAddress, signer);
  
  const tx = await campaignContract.finalizeRequest(requestIndex);
  return await tx.wait();
};

