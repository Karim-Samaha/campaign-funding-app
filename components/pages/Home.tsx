'use client'
import React, { useState, useEffect } from 'react'
import DisplayCampaigns from '../DisplayCampaigns';
import { useCampaigns } from '@/hooks/useCampaigns';

// import { useStateContext } from '../context'

const Home = () => {
  const { campaigns, loading, error } = useCampaigns();

  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={loading}
      campaigns={campaigns}
    />
  )
}

export default Home
