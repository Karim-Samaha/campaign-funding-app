import { CampaignDetails } from "@/components/pages";
import { Suspense } from "react";
import Loader from "@/components/Loader";

export default function CampaignDetailsPage() {
    return (
        <Suspense fallback={<Loader />}>
            <CampaignDetails />
        </Suspense>
    )
}