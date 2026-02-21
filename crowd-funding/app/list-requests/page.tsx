import { ListRequests } from "@/components/pages";
import { Suspense } from "react";
import Loader from "@/components/Loader";

export default function ListRequestsPage() {
    return (
        <Suspense fallback={<Loader />}>
            <ListRequests />
        </Suspense>
    )
}

