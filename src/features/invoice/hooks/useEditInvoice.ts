"use client";

import { useMutation } from "@tanstack/react-query";
import { InvoiceFormInputs } from "../schemas";

export const useEditInvoice = (options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) => {
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<InvoiceFormInputs> }) => {
            const res = await fetch(`/api/invoices/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to update invoice");
            }

            return res.json();
        },
        ...options,
    });
};
