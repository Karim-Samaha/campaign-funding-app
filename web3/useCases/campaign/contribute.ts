import { Signer, Provider } from 'ethers';
import { getCampaignContract } from '../utils/getContract';

/**
 * Contribute to a campaign
 * @param campaignAddress - Address of the campaign contract
 * @param amount - Amount to contribute in wei
 * @param signer - Signer (required for payable transactions)
 * @returns Transaction receipt
 */
export const contribute = async (
  campaignAddress: string,
  amount: bigint,
  signer: Signer
) => {
  const campaignContract = getCampaignContract(campaignAddress, signer);
  
  const tx = await campaignContract.contribute({ value: amount });
  return await tx.wait();
};

