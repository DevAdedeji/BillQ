"use client";

import { useQuery } from "@tanstack/react-query";
import { Invoice } from "@/features/invoice/types";

export interface Client {
    id: string;
    name: string;
    email: string;
    address?: string | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
    invoices?: Invoice[]
}

export const useClients = () => {
    return useQuery<Client[], Error>({
        queryKey: ["clients"],
        queryFn: async () => {
            const res = await fetch("/api/clients", { cache: "no-store" })
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Failed to fetch clients")
            }
            const data = await res.json()
            return data.data as Client[]
        },
        staleTime: 1000 * 60
    });
};


export const useClientDetails = (id: string) => {
    return useQuery<Client, Error>({
        queryKey: ["invoice-details", id],
        queryFn: async ({ queryKey }) => {
            const [_key, id] = queryKey
            const res = await fetch(`/api/clients/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || "Failed to fetch clients details")
            }
            const data = await res.json()
            return data.data as Client
        },
        staleTime: 1000 * 60,
        enabled: !!id,
    })
}