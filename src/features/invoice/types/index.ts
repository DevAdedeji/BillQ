import { Client } from "@/features/clients/types"

export interface InvoiceItem {
    id: string
    invoiceId: string
    name: string
    description?: string | null
    quantity: number
    price: number
    totalPrice: number
}

export type InvoiceStatus = "PENDING" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | "CANCELLED"

export interface Invoice {
    id: string
    userId: string
    clientId: string
    client: Client
    dueDate: string | Date
    status: InvoiceStatus
    tax?: number
    discount?: number
    paidAmount?: number
    totalAmount: number
    dueAmount: number
    items: InvoiceItem[]
    createdAt: string | Date
    updatedAt: string | Date
    issueDate: string | Date
    invoiceNumber: string
}
