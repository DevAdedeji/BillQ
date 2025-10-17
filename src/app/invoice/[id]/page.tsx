import { notFound } from "next/navigation"
import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/utils"
import PublicInvoicePreview from "@/features/invoice/components/PublicInvoicePreview"
import { InvoiceStatus } from "@/features/invoice/types"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const invoice = await prisma.invoice.findUnique({
        where: { id },
        select: {
            invoiceNumber: true,
            client: { select: { name: true } },
            totalAmount: true,
        },
    })

    if (!invoice) return { title: "Invoice not found" }

    return {
        title: `Invoice ${invoice.invoiceNumber} - ${invoice.client.name}`,
        openGraph: {
            title: `Invoice ${invoice.invoiceNumber} - ${invoice.client.name}`,
            description: `Total Amount: ${formatCurrency(invoice.totalAmount)}`,
        },
    }
}

export default async function PublicInvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
            client: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    brandName: true,
                    brandEmail: true,
                    brandAddress: true,
                    note: true,
                    terms: true,
                    selectedTemplateId: true
                },
            },
            items: true,
        },
    })

    if (!invoice) return notFound()


    const formattedInvoice = {
        ...invoice,
        status: invoice.status.toLowerCase() as InvoiceStatus,
    }

    return (
        <PublicInvoicePreview invoice={formattedInvoice} />
    )
}
