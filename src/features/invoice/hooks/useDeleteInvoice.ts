"use client";

import { useMutation } from "@tanstack/react-query";

export const useDeleteInvoice = (options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) => {
    return useMutation({
        mutationFn: async (invoiceId: string) => {
            const res = await fetch(`/api/invoices/${invoiceId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete invoice");
            }

            return res.json();
        },
        ...options,
    });
};
