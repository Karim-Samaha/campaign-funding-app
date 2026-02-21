import { Contract, Signer, Provider } from 'ethers';
import { contractAddress, FactoryContractABI, CampaignContractABI } from '../../config';
import { FactoryContractInstance, CampaignContractInstance } from '../types';
import { ethers } from 'ethers';

/**
 * Get an instance of the Factory contract
 */

export const getProvider = (): ethers.BrowserProvider | null => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
};

// Get signer from provider
export const getSigner = async (): Promise<ethers.JsonRpcSigner | null> => {
  const provider = getProvider();
  if (!provider) {
    throw new Error('No provider found. Please install MetaMask or another Web3 wallet.');
  }
  return await provider.getSigner();
};

export const getFactoryContract = async (
): Promise<any> => {
  const signer = await getSigner();
  if (!signer) {
    throw new Error('No signer found. Please install MetaMask or another Web3 wallet.');
  }

  return new Contract(
    contractAddress,
    FactoryContractABI,
    signer
  ) as FactoryContractInstance;
};

/**
 * Get an instance of a Campaign contract
 */
export const getCampaignContract = async (
  campaignAddress: string,
): Promise<CampaignContractInstance> => {
  const signer = await getSigner();
  if (!signer) {
    throw new Error('No signer found. Please install MetaMask or another Web3 wallet.');
  }
  return new Contract(
    campaignAddress,
    CampaignContractABI,
    signer
  ) as CampaignContractInstance;

  // For backward compatibility, try to get signer
  // But this should be called with signerOrProvider in most cases
  throw new Error('signerOrProvider is required');
};

