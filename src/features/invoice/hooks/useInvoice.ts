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

export const useInvoiceDetails = (id: string) => {
    return useQuery<Invoice, Error>({
        queryKey: ["invoice-details", id],
        queryFn: async ({ queryKey }) => {
            const [_key, id] = queryKey
            const res = await fetch(`/api/invoices/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || "Failed to fetch invoice details")
            }
            const data = await res.json()
            return data.data as Invoice
        },
        staleTime: 1000 * 60,
        enabled: !!id,
    })
}