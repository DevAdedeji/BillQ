"use client";

import { useMutation } from "@tanstack/react-query";
import { ClientSchemaInputs } from "../schemas";
import { editClient } from "../services";

export const useEditClient = (options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ClientSchemaInputs> }) => editClient({ id, data }),
        ...options,
    });
};
