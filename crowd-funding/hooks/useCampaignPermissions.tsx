import { getApprovers, getManager, getProvider, getSigner } from '@/web3/useCases'
import { useEffect, useState } from 'react'

export const useCampaignPermissions = (campaignAddress: string) => {
  const [userAddress, setUserAddress] = useState<string>('')
  const [isManager, setIsManager] = useState(false)
  const [isApprover, setIsApprover] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!campaignAddress) return

    const fetchPermissions = async () => {
      try {
        setIsLoading(true)
        const provider = getProvider()
        if (!provider) return

        const signer = await getSigner()
        if (!signer) return

        const address = await signer.getAddress()
        setUserAddress(address)

        // Check if user is manager
        const manager = await getManager(campaignAddress, provider)
        setIsManager(manager.toLowerCase() === address.toLowerCase())

        // Check if user is an approver
        const approver = await getApprovers(campaignAddress, address, provider)
        setIsApprover(approver)
      } catch (error) {
        console.error('Error fetching permissions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPermissions()
  }, [campaignAddress])

  return {
    userAddress,
    isManager,
    isApprover,
    isLoading
  }
}

