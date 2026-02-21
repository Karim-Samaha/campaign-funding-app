import { createRequest, getCurrentAccount, getManager } from "@/web3/useCases"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const useCreateCampaignRequest = ({ campaignAddress }: { campaignAddress: string }) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [userAddress, setUserAddress] = useState<string>('')
    const [isManager, setIsManager] = useState(false)
    const [form, setForm] = useState({
        description: '',
        value: '',
        recipient: ''
    })
    const handleFormFieldChange = (fieldName: string, e: any) => {
        setForm({ ...form, [fieldName]: e.target.value })
    }

    useEffect(() => {
        if (!campaignAddress) return

        const checkManager = async () => {
            try {
           
                const manager = await getManager(campaignAddress)
                const currentAddress = await getCurrentAccount()
                setIsManager(manager.toLowerCase() === currentAddress?.toLowerCase())
            } catch (error) {
                console.error('Error checking manager:', error)
            }
        }

        checkManager()
    }, [campaignAddress])
    const handleRequest = async () => {

        try {
            setIsSubmitting(true)


            const amountInWei = BigInt(form.value)

            await createRequest(
                campaignAddress,
                form.description,
                amountInWei,
                form.recipient,
            )

            alert('Request created successfully!')
            router.push(`/list-requests?address=${campaignAddress}`)
        } catch (error: any) {
            console.error('Error creating request:', error)
            alert(`Error: ${error.message || 'Failed to create request'}`)
        } finally {
            setIsSubmitting(false)
        }
    }
    return { handleFormFieldChange, handleRequest, isLoading, isSubmitting, userAddress, isManager, form }
}