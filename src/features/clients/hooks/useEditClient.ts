"use client";

import { useMutation } from "@tanstack/react-query";
import { ClientSchemaInputs } from "../schemas";

export const useEditClient = (options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) => {
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<ClientSchemaInputs> }) => {
            const res = await fetch(`/api/clients/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to update client");
            }

            return res.json();
        },
        ...options,
    });
};
