import { InvoicePageData, Invoice } from "../types";
import { InvoiceFormInputs } from "../schemas";

export const fetchInvoices = async (
  status: string,
  page: number,
): Promise<InvoicePageData> => {
  const res = await fetch(`/api/invoices?status=${status}&page=${page}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch invoices");
  }
  const data = await res.json();
  return data.data as InvoicePageData;
};

export const fetchInvoiceDetails = async (id: string): Promise<Invoice> => {
  const res = await fetch(`/api/invoices/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch invoice details");
  }
  const data = await res.json();
  return data.data as Invoice;
};

export const createInvoice = async (data: InvoiceFormInputs) => {
  const res = await fetch("/api/invoices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || error.message || "Unable to create invoice");
  }
  return res.json();
};

export const createInvoiceWithAi = async (prompt: string) => {
  const res = await fetch("/api/ai/invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || error.message || "Unable to create invoice");
  }
  return res.json();
};

export const deleteInvoice = async (id: string) => {
  const res = await fetch(`/api/invoices/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete invoice");
  }
  return res.json();
};

export const editInvoice = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<InvoiceFormInputs>;
}) => {
  const res = await fetch(`/api/invoices/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update invoice");
  }

  return res.json();
};

export const handlePay = async (invoiceId: string, amount: number) => {
  const res = await fetch("/api/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invoiceId, amount }),
  });

  const data = await res.json();
  return data;
};

export const verifyPayment = async (sessionId: string) => {
  const res = await fetch(`/api/pay/verify?session_id=${sessionId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to verify payment");
  }
  const data = await res.json();
  return data;
};
