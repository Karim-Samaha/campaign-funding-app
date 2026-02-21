import { getCampaignSummary, getProvider } from '@/web3/useCases'
import { useEffect, useState, useCallback } from 'react'
import { CampaignSummary } from '@/web3/useCases/types'

export const useCampaignSummary = (campaignAddress: string) => {
  const [campaignInfo, setCampaignInfo] = useState<CampaignSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaignSummary = useCallback(async () => {
    if (!campaignAddress) return

    try {
      setIsLoading(true)
      setError(null)

      const summary = await getCampaignSummary(campaignAddress)
      setCampaignInfo(summary)
    } catch (err: any) {
      console.error('Error fetching campaign summary:', err)
      setError(err.message || 'Failed to fetch campaign summary')
    } finally {
      setIsLoading(false)
    }
  }, [campaignAddress])

  useEffect(() => {
    fetchCampaignSummary()
  }, [fetchCampaignSummary])

  return {
    campaignInfo,
    isLoading,
    error,
    refresh: fetchCampaignSummary
  }
}

