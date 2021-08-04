import { useEffect } from "react";
import useSWR, { mutate } from "swr";
const sessionUrl = "api/auth/session"

async function fetchSession(url) {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Could not fetch session from ${url}`)
    }

    const session = await response.json()

    if (!session || Object.keys(session).length === 0) {
        return null;
    }
    return session
}

export function useAuth(refreshInterval) {
    const { data, error } = useSWR(sessionUrl, fetchSession, {
        revalidateOnFocus: true,
        revalidateOnMount: true,
        revalidateOnReconnect: true
    })

    useEffect(() => {
        const intervalId = setInterval(
            () => mutate(sessionUrl),
            (refreshInterval || 20) * 1000,
        )
        return () => clearInterval(intervalId)
    }, [])
    
    return {
        session: data,
        loading: typeof data === "undefined" && typeof error === "undefined",
    }
}