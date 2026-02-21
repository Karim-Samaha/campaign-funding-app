import { Signer, Provider } from 'ethers';
import { getFactoryContract } from '../utils/getContract';

/**
 * Get all deployed campaign addresses from the factory contract
 * @param signerOrProvider - Signer or Provider
 * @returns Array of campaign addresses
 */
export const getDeployedCampaigns = async (
): Promise<string[]> => {
  const factoryContract = await getFactoryContract();
  return await factoryContract.getDeployedCampaigns();
};

