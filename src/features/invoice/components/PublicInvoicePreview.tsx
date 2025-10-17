"use client"

import { printPDF } from "@/utils/printPDF"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils"
import { Invoice } from "../types"

interface PreviewProps {
    invoice: Invoice
}

export default function PublicInvoicePreview({ invoice }: PreviewProps) {
    const handleDownloadPDF = async () => {
        printPDF("print-area")
    }

    const user = invoice.user
    const client = invoice.client

    const formatDate = (date: string | Date) => {
        const d = new Date(date)
        return d.toISOString().split("T")[0]
    }
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col gap-4 items-center justify-center">
            <Button onClick={() => handleDownloadPDF()}>Download PDF</Button>
            <div className="flex items-center justify-center min-w-[700px] xl:w-[80%] mx-auto">
                <div id="print-area" className="w-full bg-white shadow-2xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <h1 className="font-bold text-2xl">Invoice</h1>
                        <h1 className="font-bold text-2xl"> {user.brandName || user.name} </h1>
                    </div>
                    <div className="mt-10 flex flex-col gap-1 text-base">
                        <p><span className="font-bold">Invoice#: </span>{invoice.invoiceNumber}</p>
                        <p><span className="font-bold">Invoice Date: </span>{formatDate(invoice.issueDate)}</p>
                        <p><span className="font-bold">Due Date: </span>{formatDate(invoice.dueDate)}</p>
                        <p className="capitalize"><span className="font-bold">Payment Status: </span>{invoice.status}</p>
                    </div>
                    <div className="mt-10 grid grid-cols-2 bg-muted/50 rounded-md p-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="font-semibold">Billed By</h2>
                            <p>{user.brandName || user.name}</p>
                            <p>{user.brandEmail}</p>
                            <p>{user.brandAddress}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="font-semibold">Billed To</h2>
                            <p>{client.name}</p>
                            <p>{client.email}</p>
                            <p>{client.address}</p>
                        </div>
                    </div>
                    <div className="mt-10">
                        <table className="w-full">
                            <thead className="!bg-black text-white h-10">
                                <tr>
                                    <th className="text-left pl-2">Item Name/Description</th>
                                    <th className="text-left">Qty</th>
                                    <th className="text-left">Price</th>
                                    <th className="text-right pr-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    invoice.items && invoice.items.length > 0 &&
                                    invoice.items.map((item) => (
                                        <tr key={item.id} className="min-h-10 border-b">
                                            <td className="pl-2 py-2">
                                                <p>{item.name}</p>
                                                <p className="mt-2 text-sm max-w-[400px]">{item.description}</p>
                                            </td>
                                            <td>
                                                {item.quantity}
                                            </td>
                                            <td className="py-2">
                                                {formatCurrency(item.price)}
                                            </td>
                                            <td className="pr-2 py-2 text-right">
                                                {formatCurrency(item.totalPrice)}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-10 grid grid-cols-4 gap-4">
                        <div>
                            <p>Tax</p>
                            <p className="font-semibold">{formatCurrency(invoice.tax)}</p>
                        </div>
                        <div>
                            <p>Discount</p>
                            <p className="font-semibold">{formatCurrency(invoice.discount)}</p>
                        </div>
                        <div>
                            <p>Due Amount</p>
                            <p className="font-semibold">{formatCurrency(invoice.dueAmount)}</p>
                        </div>
                        <div>
                            <p>Paid Amount</p>
                            <p className="font-semibold">{formatCurrency(invoice.paidAmount)}</p>
                        </div>
                        <div>
                            <p>Total Amount</p>
                            <p className="font-semibold">{formatCurrency(invoice.totalAmount)}</p>
                        </div>
                    </div>
                    {
                        user.terms &&
                        <div className="mt-10">
                            <p>Terms</p>
                            <p className="font-semibold">{user.terms}</p>
                        </div>
                    }
                    {
                        user.note &&
                        <div className="mt-10">
                            <p>Note</p>
                            <p className="font-semibold">{user.note}</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}