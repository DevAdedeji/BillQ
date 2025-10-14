"use client";

import { useQuery } from "@tanstack/react-query";

export interface Client {
    id: string;
    name: string;
    email: string;
    address?: string | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
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
