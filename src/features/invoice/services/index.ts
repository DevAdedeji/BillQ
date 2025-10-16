import { Invoice } from "../types"
import { InvoiceFormInputs } from "../schemas";

export const fetchInvoices = async (): Promise<Invoice[]> => {
    const res = await fetch("/api/invoices", { cache: "no-store" })
    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to fetch invoices")
    }
    const data = await res.json()
    return data.data as Invoice[]
}

export const fetchInvoiceDetails = async (id: string): Promise<Invoice> => {
    const res = await fetch(`/api/invoices/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to fetch invoice details")
    }
    const data = await res.json()
    return data.data as Invoice
}

export const createInvoice = async (data: InvoiceFormInputs) => {
    const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || error.message || "Unable to create invoice")
    }
    return res.json()
}

export const deleteInvoice = async (id: string) => {
    const res = await fetch(`/api/invoices/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete invoice");
    }
    return res.json();
}

export const editInvoice = async ({ id, data }: { id: string; data: Partial<InvoiceFormInputs> }) => {
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
}