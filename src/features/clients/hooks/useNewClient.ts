"use client"

import { useMutation } from "@tanstack/react-query"
import { ClientSchemaInputs } from "../schemas"

export const useNewCLient = (options?: {
    onSuccess?: (data: unknown) => void
    onError?: (data: unknown) => void
}) => {
    return useMutation({
        mutationFn: async ({ name, email, companyName }: ClientSchemaInputs) => {
            const res = await fetch("/api/clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, companyName })
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || error.message || "Unable to create client")
            }
            return res.json()
        },
        ...options
    })
}