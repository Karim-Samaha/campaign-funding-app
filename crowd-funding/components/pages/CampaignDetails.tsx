'use client'
import { useSearchParams } from 'next/navigation'
import { ethers } from 'ethers'
import { thirdweb } from '@/assets'
import { CountBox, CustomButton, Loader } from '@/components'
import Image from 'next/image'
import Link from 'next/link'
import { useCampaignPermissions, useCampaignSummary, useContribution } from '@/hooks'
import { LoaderLayout } from '../LoaderLayout'

const CampaignDetails = () => {
  const searchParams = useSearchParams()
  const campaignAddress = searchParams.get('address') || ''
  const { campaignInfo, isLoading} = useCampaignSummary(campaignAddress)
  const { amount, isContributing, changeAmount, handleContribute } = useContribution({
    campaignAddress,
  })
  const { isManager } = useCampaignPermissions(campaignAddress)

  if (!campaignAddress) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="font-epilogue font-semibold text-[18px] text-white">
          No campaign address provided
        </p>
      </div>
    )
  }


  const formatEther = (value: bigint) => {
    return ethers.formatEther(value)
  }


  return (
    <LoaderLayout isLoading={isLoading && !campaignInfo || isContributing}>
      <div>
        {isLoading && <Loader />}

        <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
          <div className="flex-1 flex-col">
            <div className="w-full h-[410px] bg-[#1c1c24] rounded-xl flex items-center justify-center">
              <p className="font-epilogue font-normal text-[16px] text-[#808191]">Campaign Image</p>
            </div>
            <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2 rounded-full">
              <div
                className="absolute h-full bg-[#4acd8d] rounded-full"
                style={{
                  width: `${campaignInfo ? (Number(campaignInfo.balance) / Number(campaignInfo.minimumContribution) * 100 > 100 ? 100 : Number(campaignInfo.balance) / Number(campaignInfo.minimumContribution) * 100) : 0}%`,
                  maxWidth: '100%'
                }}
              />
            </div>
          </div>

          <div className="flex md:w-auto w-full flex-wrap justify-between gap-[30px]">
            {/* <CountBox
            title="Minimum Contribution"
            value={`${campaignInfo ? campaignInfo.minimumContribution : '0'} ETH`}
          /> */}
            <CountBox
              title="Total Balance"
              value={`${campaignInfo ? formatEther(campaignInfo.balance) : '0'} ETH`}
            />
            <CountBox
              title="Total Contributors"
              value={campaignInfo?.approversCount?.toString() || '0'}
            />
            <CountBox
              title="Total Requests"
              value={campaignInfo?.requestsCount?.toString() || '0'}
            />
          </div>
        </div>

        <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
          <div className="flex-[2] flex flex-col gap-[40px]">
            <div>
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Campaign Manager</h4>

              <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                  <Image src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
                </div>
                <div>
                  <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                    {campaignInfo?.manager || 'Loading...'}
                  </h4>
                  <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                    Campaign Manager
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Campaign Information</h4>

              <div className="mt-[20px]">
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] mb-4">
                  <strong className="text-white">Campaign Address:</strong> {campaignAddress}
                </p>
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] mb-4">
                  <strong className="text-white">Minimum Contribution:</strong> {campaignInfo ? formatEther(campaignInfo.minimumContribution) : '0'} ETH
                </p>
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] mb-4">
                  <strong className="text-white">Total Balance:</strong> {campaignInfo ? formatEther(campaignInfo.balance) : '0'} ETH
                </p>
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] mb-4">
                  <strong className="text-white">Total Contributors:</strong> {campaignInfo?.approversCount?.toString() || '0'}
                </p>
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px]">
                  <strong className="text-white">Total Requests:</strong> {campaignInfo?.requestsCount?.toString() || '0'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Actions</h4>

              <div className="flex flex-wrap gap-4">
                {isManager && (
                  <Link href={`/create-request?address=${campaignAddress}`}>
                    <CustomButton
                      btnType="button"
                      title="Create Request"
                      styles="bg-[#8c6dfd]"
                      handleClick={() => { }}
                    />
                  </Link>
                )}

                <Link href={`/list-requests?address=${campaignAddress}`}>
                  <CustomButton
                    btnType="button"
                    title="View All Requests"
                    styles="bg-[#4acd8d]"
                    handleClick={() => { }}
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Fund</h4>

            <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
              <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
                Fund the campaign
              </p>
              <div className="mt-[30px]">
                <input
                  type="number"
                  placeholder={`Wei ${campaignInfo?.minimumContribution}`}
                  step="0.01"
                  min={campaignInfo ? formatEther(campaignInfo.minimumContribution) : '0.1'}
                  className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                  value={amount}
                  onChange={(e) => changeAmount(e.target.value)}
                />

                <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                  <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back it because you believe in it.</h4>
                  <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                    Support the project for no reward, just because it speaks to you.
                  </p>
                  {campaignInfo && (
                    <p className="mt-[10px] font-epilogue font-normal text-[12px] leading-[22px] text-[#4acd8d]">
                      Minimum contribution: {campaignInfo.minimumContribution} Wei
                    </p>
                  )}
                </div>

                <CustomButton
                  btnType="button"
                  title={isContributing ? "Contributing..." : "Fund Campaign"}
                  styles="w-full bg-[#8c6dfd]"
                  handleClick={handleContribute}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoaderLayout>
  )
}

export default CampaignDetails
