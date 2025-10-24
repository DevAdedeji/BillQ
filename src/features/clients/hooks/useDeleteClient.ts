"use client";

import { useMutation } from "@tanstack/react-query";
import { deleteClient } from "../services";

export const useDeleteClient = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation({
    mutationFn: (clientId: string) => deleteClient(clientId),
    ...options,
  });
};
