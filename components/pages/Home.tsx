'use client'
import DisplayCampaigns from '../DisplayCampaigns';
import { useCampaigns } from '@/hooks/useCampaigns';


const Home = () => {
  const { campaigns, loading } = useCampaigns();

  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={loading}
      campaigns={campaigns}
    />
  )
}

export default Home
