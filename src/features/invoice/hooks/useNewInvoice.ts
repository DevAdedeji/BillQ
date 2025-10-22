"use client"

import { useMutation } from "@tanstack/react-query"
import { InvoiceFormInputs } from "../schemas"
import { createInvoice, createInvoiceWithAi } from "../services"
import { toast } from "sonner"
import { getErrorMessage } from "@/utils"
import { useRouter } from "next/navigation"


export const useNewInvoice = () => {
    const router = useRouter()
    return useMutation({
        mutationFn: (data: InvoiceFormInputs) => createInvoice(data),
        onSuccess: (data) => {
            toast.success("Invoice created successfully")
            router.push(`/dashboard/invoices/${data.invoice.id}`)
        },
        onError: (e: unknown) => {
            toast.error(getErrorMessage(e) || "Something went wrong")
        },
    })
}

export const useNewInvoiceWithAI = () => {
    const router = useRouter()
    return useMutation({
        mutationFn: (prompt: string) => createInvoiceWithAi(prompt),
        onSuccess: (data) => {
            toast.success("Invoice created successfully")
            router.push(`/dashboard/invoices/${data.invoice.id}`)
        },
        onError: (e: unknown) => {
            toast.error(getErrorMessage(e) || "Something went wrong")
        },
    })
}