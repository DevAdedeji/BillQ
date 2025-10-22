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
import { TriangleAlert, CircleDollarSign, Users, ScrollText, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function LoadingSkeleton() {
    return (
        <div className="flex flex-col gap-6 py-8 px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Skeleton className="w-full h-[120px] bg-slate-200" />
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
        <div className="flex flex-col gap-10 px-4 py-8 lg:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <h2 className="text-2xl font-semibold">Welcome back!</h2>
                <div className="w-auto flex items-center gap-4">
                    <Button className="w-1/2 md:w-fit">
                        <Plus />
                        <span>New Invoice</span>
                    </Button>
                    <Button className="w-1/2 md:w-fit" variant={"outline"}>
                        <Plus />
                        <span>New Client</span>
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-[#F0F0F0] bg-white h-[150px] flex flex-col justify-between p-4 rounded-md">
                    <div className="flex items-center gap-1">
                        <div className="size-11 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                            <CircleDollarSign size={24} />
                        </div>
                        <h2 className="font-medium text-sm text-[#5A5A5A]">Total Earned</h2>
                    </div>
                    <p className="text-black text-xl lg:text-2xl font-semibold">{formatCurrency(data?.totalEarned)}</p>
                </div>
                <div className="border border-[#F0F0F0] bg-white min-h-[150px] flex flex-col justify-between p-4 rounded-md">
                    <div className="flex items-center gap-1">
                        <div className="size-11 rounded-full bg-[#FDECEC] text-red-600 flex items-center justify-center">
                            <TriangleAlert size={24} />
                        </div>
                        <h2 className="font-medium text-sm text-[#5A5A5A]">Total Due</h2>
                    </div>
                    <p className="text-black text-xl lg:text-2xl font-semibold">{formatCurrency(data?.totalDue)}</p>
                </div>
                <div className="border border-[#F0F0F0] bg-white h-[150px] flex flex-col justify-between p-4 rounded-md">
                    <div className="flex items-center gap-1">
                        <div className="size-11 rounded-full bg-[#F4F4F4] text-[#5A5A5A] flex items-center justify-center">
                            <ScrollText size={24} />
                        </div>
                        <h2 className="font-medium text-sm text-[#5A5A5A]">Total Invoices</h2>
                    </div>
                    <p className="text-black text-xl lg:text-2xl font-semibold">{data?.totalInvoices}</p>
                </div>
                <div className="border border-[#F0F0F0] bg-white h-[150px] flex flex-col justify-between p-4 rounded-md">
                    <div className="flex items-center gap-1">
                        <div className="size-11 rounded-full bg-[#F4F4F4] text-[#5A5A5A] flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <h2 className="font-medium text-sm text-[#5A5A5A]">Total Clients</h2>
                    </div>
                    <p className="text-black text-xl lg:text-2xl font-semibold">{data?.totalClients}</p>
                </div>
            </div>
            <div className="flex lg:flex-row flex-col justify-between gap-6 overflow-x-hidden">
                <div className="w-full lg:w-1/2 border border-[#F0F0F0] bg-white p-4 rounded-md flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-medium">Latest Invoices</h2>
                        <Link href="/dashboard/invoices" className="text-xs text-primary font-semibold underline">View all invoices</Link>
                    </div>
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
                <div className="w-full lg:w-1/2 border border-[#F0F0F0] bg-white p-4 rounded-md flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-medium">Latest Payments</h2>
                        <Link href="/dashboard/invoices" className="text-xs text-primary font-semibold underline">View all payments</Link>
                    </div>
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