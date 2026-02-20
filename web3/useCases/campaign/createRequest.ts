import { Signer, Provider } from 'ethers';
import { getCampaignContract } from '../utils/getContract';

/**
 * Create a spending request for a campaign
 * @param campaignAddress - Address of the campaign contract
 * @param description - Description of the request
 * @param value - Amount to request in wei
 * @param recipient - Address that will receive the funds
 * @param signer - Signer (required for transactions)
 * @returns Transaction receipt
 */
export const createRequest = async (
  campaignAddress: string,
  description: string,
  value: bigint,
  recipient: string,
  signer: Signer
) => {
  const campaignContract = getCampaignContract(campaignAddress, signer);
  
  const tx = await campaignContract.createRequest(description, value, recipient);
  return await tx.wait();
};

