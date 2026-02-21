import { Signer, Provider, ethers } from 'ethers';
import { getFactoryContract } from '../utils/getContract';

/**
 * Create a new campaign with the specified minimum contribution
 * @param minimum - Minimum contribution amount in wei
 * @param signerOrProvider - Signer (for transactions) or Provider (for read-only)
 * @returns Transaction receipt
 */
export const createCampaign = async (
  data: {name: string, description: string, minimum: string},  
  signerOrProvider?: Signer | Provider
) => {
  const factoryContract = await getFactoryContract();
  
  // Ensure we have a signer for transactions
  // if (!('sendTransaction' in signerOrProvider)) {
  //   throw new Error('Signer is required to create a campaign');
  // }
  // const _data = { ...data, minimum: ethers.parseEther(data.minimum.toString()) };
  // console.log(_data.name, _data.description, _data.minimum);
  const tx = await factoryContract.createCampaign(data.name, data.description, data.minimum);
  return await tx.wait();
};

