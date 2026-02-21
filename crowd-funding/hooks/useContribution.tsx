import { contribute, getSigner } from '@/web3/useCases'
import { ethers } from 'ethers'
import { useState } from 'react'

interface UseContributionProps {
  campaignAddress: string
  onSuccess?: () => void
}

export const useContribution = ({ campaignAddress }: UseContributionProps) => {
  const [amount, setAmount] = useState('')
  const [isContributing, setIsContributing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeAmount = (value: string) => {
    setAmount(value)
    setError(null)
  }

  const handleContribute = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    try {
      setIsContributing(true)
      setError(null)
 

      // Convert ETH to wei
      // If user entered amount as "wei", convert it to ETH first, then convert to WEI (bigint).
      // For example: 20 wei -> 0.000000000000000020 ETH -> now convert to WEI as bigint
      const amountInWei = BigInt(amount)
      console.log({amountInWei})
      await contribute(campaignAddress, amountInWei)

      // Clear amount on success
      setAmount('')
      
    
    } catch (err: any) {
      console.error('Error contributing:', err)
      const errorMessage = err.message || 'Failed to contribute'
      setError(errorMessage)
      // Re-throw so caller can handle it (e.g., show alert)
      throw new Error(errorMessage)
    } finally {
      setIsContributing(false)
    }
  }

  return {
    amount,
    isContributing,
    error,
    changeAmount,
    handleContribute
  }
}

