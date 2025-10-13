"use client";

import { useMutation } from "@tanstack/react-query";

export const useDeleteClient = (options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) => {
    return useMutation({
        mutationFn: async (clientId: string) => {
            const res = await fetch(`/api/clients/${clientId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete client");
            }

            return res.json();
        },
        ...options,
    });
};
