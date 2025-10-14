"use client"
import { useQuery } from "@tanstack/react-query"
import { Invoice } from "../types"

export const useInvoices = () => {
    return useQuery<Invoice[], Error>({
        queryKey: ["invoices"],
        queryFn: async () => {
            const res = await fetch("/api/invoices", { cache: "no-store" })
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Failed to fetch invoices")
            }
            const data = await res.json()
            return data.data as Invoice[]
        },
        staleTime: 1000 * 60
    })
}