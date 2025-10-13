import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { useSession } from "next-auth/react"

export async function getCurrentUser() {
    const session = await getServerSession(authOptions)
    return session?.user ?? null
}

export function useCurrentUser() {
    const { data: session, status } = useSession()
    return {
        user: session?.user ?? null,
        isLoading: status === "loading",
        isAuthenticated: !!session?.user,
    }
}
