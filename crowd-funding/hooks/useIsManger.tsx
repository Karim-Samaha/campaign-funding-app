import { getCurrentAccount, getManager } from "@/web3/useCases"
import { useEffect, useState } from "react"

export const useIsManager = ({ campaignAddress }: { campaignAddress: string }) => {
    const [isManager, setIsManager] = useState(false)


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

    return { isManager }
}