"use client"
import { useQuery } from "@tanstack/react-query"
import { Payment } from "../types"
import { fetchPayments } from "../services"

export const usePayments = () => {
    return useQuery<Payment[], Error>({
        queryKey: ["payments"],
        queryFn: fetchPayments,
        staleTime: 1000 * 60
    })
}