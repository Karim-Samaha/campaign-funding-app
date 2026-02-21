import { Signer, Provider } from 'ethers';
import { getCampaignContract } from '../utils/getContract';
import { CampaignSummary } from '../types';

/**
 * Get the summary of a campaign
 * @param campaignAddress - Address of the campaign contract
 * @param signerOrProvider - Signer or Provider
 * @returns Campaign summary object
 */
export const getCampaignSummary = async (
  campaignAddress: string,
): Promise<CampaignSummary> => {
  const campaignContract = await getCampaignContract(campaignAddress);
  
  const [minimumContribution, balance, requestsCount, approversCount, manager] = 
    await campaignContract.getCampaignSummary();
  
  return {
    minimumContribution,
    balance,
    requestsCount,
    approversCount,
    manager,
  };
};

