import { useEffect, useState } from "react"
import { useIsManager } from "./useIsManger"
import { approveRequest, finalizeRequest, getAllRequests, getVoters } from "@/web3/useCases"

export const useCampaignActions = ({ campaignAddress }: { campaignAddress: string }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [requests, setRequests] = useState<any[]>([])
    const [userAddress, setUserAddress] = useState<string>('')
    const [votingStates, setVotingStates] = useState<{ [key: number]: boolean }>({})
    const [finalizingStates, setFinalizingStates] = useState<{ [key: number]: boolean }>({})
    const { isManager } = useIsManager({ campaignAddress })

    useEffect(() => {
        if (!campaignAddress) return
        setIsLoading(true)
        const fetchRequests = async () => {
            const requests = await getAllRequests(campaignAddress)
            setRequests(requests)
            setIsLoading(false)
        }
        fetchRequests()
    }, [campaignAddress])

    const handleVote = async (requestIndex: number) => {
        setIsLoading(true)
        if (votingStates[requestIndex]) {
            alert('You have already voted on this request')
            return
        }

        try {
            setVotingStates({ ...votingStates, [requestIndex]: true })


            await approveRequest(campaignAddress, BigInt(requestIndex))

            alert('Vote submitted successfully!')

            // Refresh requests
            const allRequests = await getAllRequests(campaignAddress)
            setRequests(allRequests)

            // Update voting state
            const hasVoted = await getVoters(campaignAddress, BigInt(requestIndex), userAddress)
            setVotingStates({ ...votingStates, [requestIndex]: hasVoted })
            setIsLoading(false)
        } catch (error: any) {
            console.error('Error voting:', error)
            alert(`Error: ${error.message || 'Failed to vote'}`)
            setVotingStates({ ...votingStates, [requestIndex]: false })
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFinalize = async (requestIndex: number) => {
        setIsLoading(true)
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


            await finalizeRequest(campaignAddress, BigInt(requestIndex))

            alert('Request finalized successfully!')

            // Refresh requests
            const allRequests = await getAllRequests(campaignAddress)
            setRequests(allRequests)
            setIsLoading(false)
        } catch (error: any) {
            console.error('Error finalizing:', error)
            alert(`Error: ${error.message || 'Failed to finalize request'}`)
            setIsLoading(false)
        } finally {
            setFinalizingStates({ ...finalizingStates, [requestIndex]: false })
            setIsLoading(false)
        }
    }
    return { handleVote, handleFinalize, isLoading, requests, votingStates, finalizingStates }
}