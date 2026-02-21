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
) => {
  try {
    const campaignContract = await getCampaignContract(campaignAddress);
    
    const tx = await campaignContract.contribute({ value: amount });
    return await tx.wait();
  } catch (error: any) {
    // Extract revert reason if available
    if (error.reason) {
      throw new Error(error.reason);
    }
    // Try to extract error from data if available
    if (error.data) {
      throw new Error(`Transaction failed: ${error.data}`);
    }
    // Check for common error patterns
    if (error.message) {
      // Check if it's a revert error
      const revertMatch = error.message.match(/execution reverted:?\s*(.+)/i);
      if (revertMatch) {
        throw new Error(revertMatch[1]);
      }
      // Check for insufficient funds
      if (error.message.includes('insufficient funds') || error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient funds for this transaction');
      }
      // Check for user rejection
      if (error.code === 4001 || error.message.includes('user rejected')) {
        throw new Error('Transaction was rejected');
      }
      throw new Error(error.message);
    }
    throw error;
  }
};

