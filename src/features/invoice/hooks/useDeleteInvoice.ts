"use client";
import { useMutation } from "@tanstack/react-query";
import { deleteInvoice } from "../services";

export const useDeleteInvoice = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation({
    mutationFn: (invoiceId: string) => deleteInvoice(invoiceId),
    ...options,
  });
};
