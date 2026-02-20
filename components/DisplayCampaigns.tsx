'use client';
import FundCard from './FundCard';
import { loader } from '@/assets';
import { useRouter } from 'next/navigation';

const DisplayCampaigns = ({ title, isLoading, campaigns }: { title: string, isLoading: boolean, campaigns: any[] }) => {
  const router = useRouter();

  const handleNavigate = (campaign: any) => {
    router.push(`/campaign-details?address=${campaign.campaignAddress}`)
  }

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">{title} ({campaigns.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campigns yet
          </p>
        )}
        {!isLoading && campaigns.length > 0 && campaigns.map((campaign: any) =>
          <FundCard
            key={campaign.campaignAddress}
            {...campaign}
            handleClick={() => handleNavigate(campaign)}
          />)}
      </div>
    </div>
  )
}

export default DisplayCampaigns