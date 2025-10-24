"use client";

import { useMutation } from "@tanstack/react-query";
import { InvoiceFormInputs } from "../schemas";
import { editInvoice } from "../services";

export const useEditInvoice = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<InvoiceFormInputs>;
    }) => editInvoice({ id, data }),
    ...options,
  });
};
