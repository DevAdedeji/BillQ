"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export default function NextAuthProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())
    return <QueryClientProvider client={queryClient}>
        <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
}
