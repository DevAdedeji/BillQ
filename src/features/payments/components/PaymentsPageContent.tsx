"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import EmptyTableState from "@/components/shared/EmptyTableState"
import { getErrorMessage, formatDate, formatCurrency } from "@/utils"
import { usePayments } from "../hooks"
import StatusBadge from "@/features/invoice/components/StatusBadge"

function LoadingSkeleton() {
    return <div className="flex flex-col gap-6 py-8 px-4 lg:px-8">
        <Skeleton className="w-full h-10 bg-slate-200" />
        {
            [1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-3 gap-2">
                    <Skeleton className="h-10 bg-slate-200" />
                    <Skeleton className="h-10 bg-slate-200" />
                    <Skeleton className="h-10 bg-slate-200" />
                    <Skeleton className="h-10 bg-slate-200" />
                    <Skeleton className="h-10 bg-slate-200" />
                    <Skeleton className="h-10 bg-slate-200" />
                </div>
            )
            )
        }
    </div>
}

export default function PaymentsPageContent() {
    const { data: payments, isLoading, isFetching } = usePayments()
    const isDataLoading = isLoading || (!!payments && isFetching)
    if (isDataLoading) return <LoadingSkeleton />
    return (
        <div className="flex flex-col gap-6 px-4 py-8 lg:p-8">
            <div className="rounded-lg">
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
                        payments && payments.length === 0 &&
                        <EmptyTableState colSpan={8} title="No Payments Found" description="Looks like none of your clients has made any payment" />
                    }
                    {
                        payments && payments.length > 0 &&
                        <TableBody>
                            {
                                payments.map((payment) => {
                                    const invoice = payment.invoice
                                    return (
                                        <TableRow key={payment.id}>
                                            <TableCell>{invoice?.invoiceNumber || "N/A"}</TableCell>
                                            <TableCell>{invoice?.client?.name || "N/A"}</TableCell>
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
    )
}