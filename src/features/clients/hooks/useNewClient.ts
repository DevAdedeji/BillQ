"use client"

import { useMutation } from "@tanstack/react-query"
import { ClientSchemaInputs } from "../schemas"
import { createClient } from "../services"

export const useNewCLient = (options?: {
    onSuccess?: (data: unknown) => void
    onError?: (data: unknown) => void
}) => {
    return useMutation({
        mutationFn: ({ name, email, address }: ClientSchemaInputs) => createClient({ name, email, address }),
        ...options
    })
}