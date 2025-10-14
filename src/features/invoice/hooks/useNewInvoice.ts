"use client"

import { useMutation } from "@tanstack/react-query"
import { InvoiceFormInputs } from "../schemas"

export const useNewInvoice = (options?: {
    onSuccess?: (data: unknown) => void
    onError?: (data: unknown) => void
}) => {
    return useMutation({
        mutationFn: async (data: InvoiceFormInputs) => {
            const res = await fetch("/api/invoices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || error.message || "Unable to create invoice")
            }
            return res.json()
        },
        ...options
    })
}