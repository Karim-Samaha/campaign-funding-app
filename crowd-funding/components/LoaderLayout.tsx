import Loader from "./Loader"

export const LoaderLayout = ({ isLoading, message, children }: { isLoading: boolean, message?: string, children: React.ReactNode }) => {
    if (isLoading) {
        return (
            <Loader message={message} />
        )
    }
    return children
}