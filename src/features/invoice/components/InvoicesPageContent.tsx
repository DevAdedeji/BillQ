"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"
import { useInvoices } from "../hooks/useInvoice"
import InvoiceHeader from "./InvoiceHeader"
import InvoiceStats from "./InvoiceStats"
import InvoiceTable from "./InvoiceTable"

function LoadingSkeleton() {
    return <div className="flex flex-col gap-6 py-8 px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            <Skeleton className="w-[100px] h-10 bg-slate-200 hidden lg:block" />
            <div className="self-end flex items-center gap-2">
                <Skeleton className="w-[100px] h-10 bg-slate-200" />
                <Skeleton className="w-[100px] h-10 bg-slate-200" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="w-full h-[120px] bg-slate-200" />
            <Skeleton className="w-full h-[120px] bg-slate-200" />
            <Skeleton className="w-full h-[120px] bg-slate-200" />
            <Skeleton className="w-full h-[120px] bg-slate-200" />
        </div>
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

export default function InvoicesPageContent() {

    const [selectedFilter, setSelectedFilter] = useState("all")
    const [page, setPage] = useState(1)

    const { data, isLoading, isError, refetch } = useInvoices(selectedFilter, page)

    const { invoices = [], stats, pagination } = data || {};
    const isDataLoading = isLoading

    const { totalInvoices = 0, pendingInvoices = 0, overdueInvoices = 0, paidInvoices = 0 } = stats || {}
    if (isDataLoading) return <LoadingSkeleton />

    if (isError) return <div></div>

    return (
        <div className="flex flex-col gap-6 px-4 py-8 lg:p-8">
            <InvoiceHeader />
            <InvoiceStats totalInvoices={totalInvoices} pendingInvoices={pendingInvoices} paidInvoices={paidInvoices} overdueInvoices={overdueInvoices} />
            <InvoiceTable invoices={invoices} selectedFilter={selectedFilter} setSelectedFilter={(id: string) => setSelectedFilter(id)} refresh={refetch} pagination={pagination} onPageChange={setPage} />
        </div>
    )
}
