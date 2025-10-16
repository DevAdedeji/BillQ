"use client"

import { useMutation } from "@tanstack/react-query"
import { InvoiceFormInputs } from "../schemas"
import { createInvoice } from "../services"

export const useNewInvoice = (options?: {
    onSuccess?: (data: unknown) => void
    onError?: (data: unknown) => void
}) => {
    return useMutation({
        mutationFn: (data: InvoiceFormInputs) => createInvoice(data),
        ...options
    })
}