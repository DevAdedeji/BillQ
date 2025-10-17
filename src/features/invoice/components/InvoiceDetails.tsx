"use client"

import { useInvoiceDetails } from "@/features/invoice/hooks/useInvoice"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Eye, Share2 } from "lucide-react"
import { getErrorMessage, formatDate, formatCurrency, copyToClipboard } from "@/utils"
import Link from "next/link"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
import StatusBadge from "./StatusBadge"
import { Button } from "@/components/ui/button"
import EditInvoice from "./EditInvoice"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

function LoadingSkeleton() {
    return <div className="flex flex-col gap-6 py-8 px-4 lg:px-8">
        <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-[80%] lg:w-[40%] bg-slate-200" />
            <Skeleton className="w-10 lg:w-20 h-6 bg-slate-200" />
        </div>
        <Skeleton className="w-full h-10 bg-slate-200" />
        {
            [1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-3 gap-2">
                    <Skeleton className="h-10 bg-slate-200" />
                    <Skeleton className="h-10 bg-slate-200" />
                    <Skeleton className="h-10 bg-slate-200" />
                </div>
            )
            )
        }
    </div>
}


export default function InvoiceDetails({ id }: { id: string }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { data: invoice, isPending, refetch } = useInvoiceDetails(id)

    const router = useRouter()
    const goToPreviewPage = () => {
        if (invoice) {
            router.push(`/dashboard/invoices/${invoice.id}/preview`)
        }
    }

    const copyLink = () => {
        if (invoice) {
            copyToClipboard(`https://billq.vercel.app/invoice/${invoice.id}`)
            toast.success("Copied successfully")
        }
    }
    const refreshDetails = () => {
        setIsDialogOpen(false)
        refetch()
    }

    if (isPending) return <LoadingSkeleton />

    if (invoice) return (
        <div className="flex flex-col gap-8 px-4 py-8 lg:p-8">
            <div className="flex items-center justify-between">
                <Link href="/dashboard/invoices" className="flex items-center gap-1">
                    <ArrowLeft />
                    <p>Back</p>
                </Link>
                <div className="flex items-center gap-4">
                    <Button variant={"outline"} onClick={() => goToPreviewPage()}>
                        <Eye />
                        <span className="hidden sm:block">
                            Preview
                        </span>
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>Edit Invoice</Button>
                        </DialogTrigger>
                        <EditInvoice closeDialog={() => {
                            refreshDetails()
                        }} invoice={invoice} />
                    </Dialog>
                    <Button variant={"outline"} onClick={() => copyLink()}>
                        <Share2 />
                        <span>Copy</span>
                    </Button>
                </div>
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-base font-semibold">Invoice Number</h2>
                    <p className="text-sm">{invoice.invoiceNumber}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="text-base font-semibold">Due Date</h2>
                    <p className="text-sm">{formatDate(invoice.dueDate)}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="text-base font-semibold">Client</h2>
                    <p className="text-sm">{invoice.client?.name || "N/A"}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="text-base font-semibold">Status</h2>
                    <div>
                        <StatusBadge status={invoice.status} />
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="text-base font-semibold">Paid Amount</h2>
                    <p>{formatCurrency(invoice.paidAmount)}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="text-base font-semibold">Due Amount</h2>
                    <p>{formatCurrency(invoice.dueAmount)}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="text-base font-semibold">Total Amount</h2>
                    <p>{formatCurrency(invoice.totalAmount)}</p>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Item Details</h3>
                {
                    invoice.items && invoice.items.length &&
                    <div className="space-y-3">
                        {
                            invoice.items.map((item) => (
                                <div className="w-full bg-muted/30 p-2 rounded-lg flex flex-col gap-2 text-sm" key={item.id}>
                                    <p>
                                        <span className="font-semibold mr-1">
                                            Name:
                                        </span>
                                        {item.name}
                                    </p>
                                    <p>
                                        <span className="font-semibold mr-1">
                                            Description:
                                        </span>
                                        {item.description || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-semibold mr-1">
                                            Quantity:
                                        </span>
                                        {item.quantity || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-semibold mr-1">
                                            Price:
                                        </span>
                                        {formatCurrency(item.price) || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-semibold mr-1">
                                            Total Price:
                                        </span>
                                        {formatCurrency(item.totalPrice) || "N/A"}
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        </div>
    )
}