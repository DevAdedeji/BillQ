"use client"
import { useQuery } from "@tanstack/react-query"
import { Invoice } from "../types"
import { fetchInvoices, fetchInvoiceDetails } from "../services"

export const useInvoices = () => {
    return useQuery<Invoice[], Error>({
        queryKey: ["invoices"],
        queryFn: fetchInvoices,
        staleTime: 1000 * 60
    })
}

export const useInvoiceDetails = (id: string) => {
    return useQuery<Invoice, Error>({
        queryKey: ["invoice-details", id],
        queryFn: () => fetchInvoiceDetails(id),
        staleTime: 1000 * 60,
        enabled: !!id,
    })
}