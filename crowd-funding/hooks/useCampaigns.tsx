'use client';
import { getDeployedCampaigns } from "@/web3/useCases";
import { useEffect, useState } from "react";

export const useCampaigns = () => {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const result = await getDeployedCampaigns();
                const campaignsArray = Array.from(result).map((campaign: any) => ({
                    name: campaign.name,
                    description: campaign.description,
                    minimum: campaign.minimum?.toString() || campaign.minimum,
                    campaignAddress: campaign.campaignAddress
                }));

                setCampaigns(campaignsArray);
                setLoading(false);
            } catch (error) {
                setError(error as string);
                setLoading(false);
                console.log(error);
            }
        }
        setTimeout(() => {
            fetchCampaigns();
        }, 1000);
    }, []);

    return { campaigns, loading, error };
}