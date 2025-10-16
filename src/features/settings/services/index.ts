"use client"

import { useSession } from "next-auth/react"

export const useUser = () => {
    const { update } = useSession()
    async function useUpdateProfile(data: {
        name?: string
        email?: string
        brandName?: string
        brandEmail?: string
        brandAddress?: string
    }) {
        const res = await fetch("/api/user", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })

        const result = await res.json()
        if (!res.ok) throw new Error(result.error || "Failed to update profile")
        await update()
        return result.user
    }

    async function useUpdatePassword(data: {
        oldPassword: string
        newPassword: string
    }) {
        const res = await fetch("/api/user/password", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })

        const result = await res.json()
        if (!res.ok) throw new Error(result.error || "Failed to update password")
        return result.message
    }

    return { useUpdateProfile, useUpdatePassword }
}