"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useFetchOverview } from "../hooks"
import { useRouter } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import EmptyTableState from "@/components/shared/EmptyTableState"
import { formatDate, formatCurrency } from "@/utils"
import StatusBadge from "@/features/invoice/components/StatusBadge"

function LoadingSkeleton() {
    return (
        <div className="flex flex-col gap-6 py-8 px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="w-full h-[120px] bg-slate-200" />
                <Skeleton className="w-full h-[120px] bg-slate-200" />
                <Skeleton className="w-full h-[120px] bg-slate-200" />
            </div>
            <div className="flex lg:flex-row flex-col justify-between gap-4">
                <div className="w-full flex flex-col gap-4 lg:w-1/2">
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
                <div className="w-full flex flex-col gap-4 lg:w-1/2">
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
            </div>
        </div>
    )
}

export default function OverviewPageContent() {
    const { data, isLoading, isFetching, isError } = useFetchOverview()
    const isDataLoading = isLoading || (!!data && isFetching)
    const router = useRouter()
    const goToInvoicePage = (id: string) => {
        router.push(`/dashboard/invoices/${id}`)
    }
    if (isDataLoading) return <LoadingSkeleton />
    if (isError) return <div></div>
    return (
        <div className="flex flex-col gap-10 px-4 py-8 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-100 h-[150px] flex flex-col justify-between p-6 rounded-md shadow-lg border border-slate-200">
                    <h2 className="font-medium">Total Earned</h2>
                    <p className="text-green-800 font-semibold">{formatCurrency(data?.totalEarned)}</p>
                </div>
                <div className="bg-slate-100 h-[150px] flex flex-col justify-between p-6 rounded-md shadow-lg border border-slate-200">
                    <h2 className="font-medium">Total Due</h2>
                    <p className="text-red-800">{formatCurrency(data?.totalDue)}</p>
                </div>
                <div className="bg-slate-100 h-[150px] flex flex-col justify-between p-6 rounded-md shadow-lg border border-slate-200">
                    <h2 className="font-medium">Total Invoices</h2>
                    <p>{data?.totalInvoices}</p>
                </div>
                <div className="bg-slate-100 h-[150px] flex flex-col justify-between p-6 rounded-md shadow-lg border border-slate-200">
                    <h2 className="font-medium">Total Clients</h2>
                    <p>{data?.totalClients}</p>
                </div>
            </div>
            <div className="flex lg:flex-row flex-col justify-between gap-10 overflow-x-hidden">
                <div className="w-full lg:w-1/2">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-100">
                                <TableHead>Client</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Paid Amount</TableHead>
                                <TableHead>Due Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        {
                            data?.invoices && data.invoices.length === 0 ?
                                <EmptyTableState colSpan={4} title="No Invoices Found" description="Looks like you haven&apos;t created any invoices yet." />
                                :
                                <TableBody>
                                    {
                                        data?.invoices.map((invoice) => {
                                            return (
                                                <TableRow key={invoice.id} className="hover:bg-slate-50" onClick={() => goToInvoicePage(invoice.id)}>
                                                    <TableCell className="font-medium">{invoice.client.name}</TableCell>
                                                    <TableCell className="font-medium">
                                                        <StatusBadge status={invoice.status} />
                                                    </TableCell>
                                                    <TableCell className="font-medium">{formatCurrency(invoice.paidAmount)}</TableCell>
                                                    <TableCell className="font-medium">{formatCurrency(invoice.dueAmount)}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                        }
                    </Table>
                </div>
                <div className="w-full lg:w-1/2">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-100">
                                <TableHead>Invoice Number</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Paid Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        {
                            data?.payments && data?.payments.length === 0 ?
                                <EmptyTableState colSpan={8} title="No Payments Found" description="Looks like none of your clients has made any payment" />
                                :
                                <TableBody>
                                    {
                                        data?.payments.map((payment) => {
                                            const invoice = payment.invoice
                                            return (
                                                <TableRow key={payment.id}>
                                                    <TableCell>{invoice.invoiceNumber || "N/A"}</TableCell>
                                                    <TableCell>{invoice.client.name || "N/A"}</TableCell>
                                                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={payment.status} />
                                                    </TableCell>
                                                    <TableCell>{formatDate(payment.createdAt)}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                        }
                    </Table>
                </div>
            </div>
        </div>
    )
}