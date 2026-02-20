'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ethers } from 'ethers'
import { getAllRequests, getManager, getVoters, approveRequest, finalizeRequest } from '@/web3/useCases'
import { getProvider, getSigner } from '@/web3/useCases/utils/getContract'
import { CustomButton, Loader } from '@/components'

const ListRequests = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const campaignAddress = searchParams.get('address') || ''

  const [isLoading, setIsLoading] = useState(false)
  const [requests, setRequests] = useState<any[]>([])
  const [userAddress, setUserAddress] = useState<string>('')
  const [isManager, setIsManager] = useState(false)
  const [votingStates, setVotingStates] = useState<{ [key: number]: boolean }>({})
  const [finalizingStates, setFinalizingStates] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    if (!campaignAddress) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const provider = getProvider()
        if (!provider) {
          throw new Error('No provider found')
        }

        // Get all requests
        const allRequests = await getAllRequests(campaignAddress, provider)
        setRequests(allRequests)

        // Get user address and check if manager
        const signer = await getSigner()
        if (signer) {
          const address = await signer.getAddress()
          setUserAddress(address)

          const manager = await getManager(campaignAddress, provider)
          setIsManager(manager.toLowerCase() === address.toLowerCase())

          // Check which requests the user has voted on
          const votedStates: { [key: number]: boolean } = {}
          for (let i = 0; i < allRequests.length; i++) {
            const hasVoted = await getVoters(campaignAddress, BigInt(i), address, provider)
            votedStates[i] = hasVoted
          }
          setVotingStates(votedStates)
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching requests:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [campaignAddress])

  const handleVote = async (requestIndex: number) => {
    if (votingStates[requestIndex]) {
      alert('You have already voted on this request')
      return
    }

    try {
      setVotingStates({ ...votingStates, [requestIndex]: true })
      const signer = await getSigner()
      if (!signer) {
        throw new Error('No signer found. Please connect your wallet.')
      }

      await approveRequest(campaignAddress, BigInt(requestIndex), signer)
      
      alert('Vote submitted successfully!')
      
      // Refresh requests
      const provider = getProvider()
      if (provider) {
        const allRequests = await getAllRequests(campaignAddress, provider)
        setRequests(allRequests)
        
        // Update voting state
        const hasVoted = await getVoters(campaignAddress, BigInt(requestIndex), userAddress, provider)
        setVotingStates({ ...votingStates, [requestIndex]: hasVoted })
      }
    } catch (error: any) {
      console.error('Error voting:', error)
      alert(`Error: ${error.message || 'Failed to vote'}`)
      setVotingStates({ ...votingStates, [requestIndex]: false })
    }
  }

  const handleFinalize = async (requestIndex: number) => {
    if (!isManager) {
      alert('Only the campaign manager can finalize requests')
      return
    }

    if (requests[requestIndex].completed) {
      alert('This request has already been finalized')
      return
    }

    try {
      setFinalizingStates({ ...finalizingStates, [requestIndex]: true })
      const signer = await getSigner()
      if (!signer) {
        throw new Error('No signer found. Please connect your wallet.')
      }

      await finalizeRequest(campaignAddress, BigInt(requestIndex), signer)
      
      alert('Request finalized successfully!')
      
      // Refresh requests
      const provider = getProvider()
      if (provider) {
        const allRequests = await getAllRequests(campaignAddress, provider)
        setRequests(allRequests)
      }
    } catch (error: any) {
      console.error('Error finalizing:', error)
      alert(`Error: ${error.message || 'Failed to finalize request'}`)
    } finally {
      setFinalizingStates({ ...finalizingStates, [requestIndex]: false })
    }
  }

  const formatEther = (value: bigint) => {
    return ethers.formatEther(value)
  }

  if (!campaignAddress) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="font-epilogue font-semibold text-[18px] text-white">
          No campaign address provided
        </p>
      </div>
    )
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-epilogue font-bold text-[25px] text-white">
          Campaign Requests ({requests.length})
        </h1>
        <div className="flex gap-4">
          <CustomButton
            btnType="button"
            title="Back to Campaign"
            styles="bg-[#3a3a43]"
            handleClick={() => router.push(`/campaign-details?address=${campaignAddress}`)}
          />
          {isManager && (
            <CustomButton
              btnType="button"
              title="Create Request"
              styles="bg-[#8c6dfd]"
              handleClick={() => router.push(`/create-request?address=${campaignAddress}`)}
            />
          )}
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-[#1c1c24] rounded-[10px] p-10 text-center">
          <p className="font-epilogue font-semibold text-[18px] text-[#808191]">
            No requests found. Be the first to create one!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((request, index) => (
            <div
              key={index}
              className="bg-[#1c1c24] rounded-[10px] p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-epilogue font-semibold text-[18px] text-white mb-2">
                    Request #{index}
                  </h3>
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] mb-4">
                    {request.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-[14px]">
                    <div>
                      <span className="text-[#808191]">Amount: </span>
                      <span className="text-white font-semibold">{formatEther(request.value)} ETH</span>
                    </div>
                    <div>
                      <span className="text-[#808191]">Recipient: </span>
                      <span className="text-white break-all">{request.recipient}</span>
                    </div>
                    <div>
                      <span className="text-[#808191]">Votes: </span>
                      <span className="text-white font-semibold">{request.votersCount.toString()}</span>
                    </div>
                    <div>
                      <span className={`${request.completed ? 'text-[#4acd8d]' : 'text-[#f4a261]'}`}>
                        {request.completed ? '✓ Completed' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                {!request.completed && (
                  <>
                    {!votingStates[index] && (
                      <CustomButton
                        btnType="button"
                        title="Vote"
                        styles="bg-[#4acd8d]"
                        handleClick={() => handleVote(index)}
                      />
                    )}
                    {votingStates[index] && (
                      <span className="px-4 py-2 bg-[#3a3a43] rounded-[10px] text-white text-[14px]">
                        ✓ Voted
                      </span>
                    )}
                    {isManager && (
                      <CustomButton
                        btnType="button"
                        title={finalizingStates[index] ? "Finalizing..." : "Finalize"}
                        styles="bg-[#8c6dfd]"
                        handleClick={() => handleFinalize(index)}
                      />
                    )}
                  </>
                )}
                {request.completed && (
                  <span className="px-4 py-2 bg-[#1dc071] rounded-[10px] text-white text-[14px]">
                    Request Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ListRequests

