'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { ethers } from 'ethers'
import { CustomButton, FormField, Loader } from '@/components'
import { useCreateCampaignRequest } from '@/hooks/useCreateCampaignRequest'
import { useIsManager } from '@/hooks/useIsManger'

const CreateRequest = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const campaignAddress = searchParams.get('address') || ''


    const { isManager } = useIsManager({ campaignAddress })
    const { handleFormFieldChange, handleRequest, isLoading, isSubmitting, form } =
        useCreateCampaignRequest({ campaignAddress })


    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (!isManager) {
            alert('Only the campaign manager can create requests')
            return
        }

        if (!form.description || !form.value || !form.recipient) {
            alert('Please fill in all fields')
            return
        }

        // Validate Ethereum address
        if (!ethers.isAddress(form.recipient)) {
            alert('Please enter a valid Ethereum address')
            return
        }

        await handleRequest()
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

    if (!isManager) {
        return (
            <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
                <p className="font-epilogue font-semibold text-[18px] text-white">
                    Only the campaign manager can create requests
                </p>
                <div className="mt-4">
                    <CustomButton
                        btnType="button"
                        title="Back to Campaign"
                        styles="bg-[#8c6dfd]"
                        handleClick={() => router.push(`/campaign-details?address=${campaignAddress}`)}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
            {isSubmitting && <Loader />}

            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
                    Create Spending Request
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
                <FormField
                    labelName="Description *"
                    placeholder="Describe what this request is for"
                    isTextArea
                    value={form.description}
                    handleChange={(e) => handleFormFieldChange('description', e)}
                    inputType=""
                />

                <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        labelName="Amount Wei *"
                        placeholder="00"
                        inputType="number"
                        value={form.value}
                        handleChange={(e) => handleFormFieldChange('value', e)}
                    />
                    <FormField
                        labelName="Recipient Address *"
                        placeholder="0x..."
                        inputType="text"
                        value={form.recipient}
                        handleChange={(e) => handleFormFieldChange('recipient', e)}
                    />
                </div>

                <div className="flex justify-center items-center mt-[40px] gap-4">
                    <CustomButton
                        btnType="submit"
                        title={isSubmitting ? "Creating..." : "Create Request"}
                        styles="bg-[#1dc071]"
                        handleClick={() => { }}
                    />
                    <CustomButton
                        btnType="button"
                        title="Cancel"
                        styles="bg-[#3a3a43]"
                        handleClick={() => router.push(`/campaign-details?address=${campaignAddress}`)}
                    />
                </div>
            </form>
        </div>
    )
}

export default CreateRequest

