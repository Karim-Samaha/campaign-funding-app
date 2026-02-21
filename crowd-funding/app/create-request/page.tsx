import { CreateRequest } from "@/components/pages";
import { Suspense } from "react";
import Loader from "@/components/Loader";

export default function CreateRequestPage() {
    return (
        <Suspense fallback={<Loader />}>
            <CreateRequest />
        </Suspense>
    )
}

