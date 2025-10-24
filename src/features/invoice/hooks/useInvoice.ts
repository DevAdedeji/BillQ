"use client";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { Invoice, InvoicePageData } from "../types";
import {
  fetchInvoices,
  fetchInvoiceDetails,
  handlePay,
  verifyPayment,
} from "../services";
import { toast } from "sonner";

export const useInvoices = (status: string, page: number) => {
  return useQuery<InvoicePageData, Error>({
    queryKey: ["invoices", status, page],
    queryFn: () => fetchInvoices(status, page),
    placeholderData: keepPreviousData,
  });
};

export const useInvoiceDetails = (id: string) => {
  return useQuery<Invoice, Error>({
    queryKey: ["invoice-details", id],
    queryFn: () => fetchInvoiceDetails(id),
    staleTime: 1000 * 60,
    enabled: !!id,
  });
};

export const usePayInvoice = () => {
  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      handlePay(id, amount),
    onSuccess: (data) => {
      console.log(data);
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast.error("Something went wrong, try again");
    },
  });
};

export const useVerifyPayment = (id: string) => {
  return useQuery({
    queryKey: ["session-details"],
    queryFn: () => verifyPayment(id),
    enabled: false,
  });
};
