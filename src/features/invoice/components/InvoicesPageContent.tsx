"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import NewInvoice from "./NewInvoice"
import { EllipsisVertical, Sparkles } from "lucide-react"
import { useState } from "react"
import { getErrorMessage, formatDate, formatCurrency } from "@/utils"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useInvoices } from "../hooks/useInvoice"
import { useDeleteInvoice } from "../hooks/useDeleteInvoice"
import StatusBadge from "./StatusBadge"
import { Invoice } from "../types"
import EditInvoice from "./EditInvoice"
import EmptyTableState from "@/components/shared/EmptyTableState"
import { useRouter } from "next/navigation"
import NewInvoiceWithAI from "./NewInvoiceWithAI"

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

export default function InvoicesPageContent() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isAIDialogOpen, setIsAIDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

    const { data: invoices, isLoading, isError, refetch, isFetching } = useInvoices()

    const router = useRouter()

    const isDataLoading = isLoading || (!!invoices && isFetching)

    const refreshDetails = () => {
        setIsDialogOpen(false)
        refetch()
    }

    const { mutate, isPending } = useDeleteInvoice({
        onSuccess: () => {
            toast.success("Invoice deleted successfully")
            refreshDetails()
            setOpenDropdownId(null)
        },
        onError: (err: unknown) => {
            const message = getErrorMessage(err)
            toast.error(message || "Something went wrong")
            setOpenDropdownId(null)
        }
    })

    const goToInvoicePage = (id: string) => {
        router.push(`/dashboard/invoices/${id}`)
    }

    const filteredInvoices = invoices?.filter(
        (invoice: Invoice) =>
            (invoice.invoiceNumber ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (invoice.client?.name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    )


    if (isDataLoading) return <LoadingSkeleton />

    if (isError) return <div></div>

    return (
        <div className="flex flex-col gap-6 px-4 py-8 lg:p-8">
            <div className="flex items-center justify-between gap-2">
                <Input placeholder="Search invoices" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="lg:w-[40%]" />
                <div className="flex items-center gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>New Invoice</Button>
                        </DialogTrigger>
                        <NewInvoice />
                    </Dialog>
                    <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Sparkles />
                            </Button>
                        </DialogTrigger>
                        <NewInvoiceWithAI />
                    </Dialog>
                </div>
            </div>

            {
                filteredInvoices &&
                <div className="rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-100">
                                <TableHead>Invoice Number</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Paid Amount</TableHead>
                                <TableHead>Due Amount</TableHead>
                                <TableHead>Total Amount</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        {

                            invoices && invoices.length === 0 ?
                                <EmptyTableState colSpan={8} title="No Invoices Found" description="Looks like you haven&apos;t created any invoices yet. Get started by creating your first one." />
                                :
                                invoices && invoices.length > 0 && filteredInvoices.length === 0 ?
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={8}>
                                                <div className="w-full py-10 text-center font-semibold text-xl">
                                                    <p>No invoices match your search!</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                    :
                                    <TableBody>
                                        {
                                            filteredInvoices.map((invoice) => {
                                                return (
                                                    <TableRow key={invoice.id} className="hover:bg-slate-50" onClick={() => goToInvoicePage(invoice.id)}>
                                                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                                        <TableCell className="font-medium">{formatDate(invoice.dueDate)}</TableCell>
                                                        <TableCell className="font-medium">{invoice.client?.name || "N/A"}</TableCell>
                                                        <TableCell className="font-medium">
                                                            <StatusBadge status={invoice.status} />
                                                        </TableCell>
                                                        <TableCell className="font-medium">{formatCurrency(invoice.paidAmount)}</TableCell>
                                                        <TableCell className="font-medium">{formatCurrency(invoice.dueAmount)}</TableCell>
                                                        <TableCell className="font-medium">{formatCurrency(invoice.totalAmount)}</TableCell>
                                                        <TableCell>
                                                            <DropdownMenu open={openDropdownId === invoice.id}
                                                                onOpenChange={(isOpen) => {
                                                                    if (!isPending) setOpenDropdownId(isOpen ? invoice.id : null);
                                                                }}>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="outline" onClick={(e) => e.stopPropagation()}>
                                                                        <EllipsisVertical />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent className="w-20" align="start">
                                                                    <DropdownMenuGroup>
                                                                        <DropdownMenuItem onClick={() => setSelectedInvoice(invoice)}>
                                                                            Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => mutate(invoice.id)}>
                                                                            {isPending && <Spinner />}
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuGroup>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                        }
                    </Table>
                    <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
                        <DialogTrigger asChild>
                            <div />
                        </DialogTrigger>
                        <EditInvoice closeDialog={() => {
                            refreshDetails()
                            setSelectedInvoice(null)
                        }} invoice={selectedInvoice} />
                    </Dialog>
                </div>
            }
        </div>
    )
}
