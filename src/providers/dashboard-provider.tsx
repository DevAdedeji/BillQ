"use client"

import { useDashboardStore } from "@/store/dashboard-store"
import { useEffect } from "react"
import type { User } from "next-auth"

export function DashboardProvider({ user, children }: { user: User; children: React.ReactNode }) {
    const setUser = useDashboardStore((s) => s.setUser)

    useEffect(() => {
        setUser(user)
    }, [user, setUser])

    return <>{children}</>
}
