import { Invoice } from "@/features/invoice/types"
import { useState } from "react"
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
import EditInvoice from "./EditInvoice"
import EmptyTableState from "@/components/shared/EmptyTableState"
import { useRouter } from "next/navigation"
import { EllipsisVertical } from "lucide-react"
import { getErrorMessage, formatDate, formatCurrency } from "@/utils"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useDeleteInvoice } from "../hooks/useDeleteInvoice"
import StatusBadge from "./StatusBadge"
import { PaginationControls } from "@/components/shared/PaginationControls"

interface InvoiceTableProps {
    invoices: Invoice[]
    selectedFilter: string
    setSelectedFilter: (id: string) => void
    refresh: () => void
    pagination?: {
        page: number
        limit: number
        totalPages: number
        totalInvoices: number
        hasNextPage: boolean
        hasPreviousPage: boolean
    },
    onPageChange: (page: number) => void
}

export default function InvoiceTable({ invoices, selectedFilter, setSelectedFilter, refresh, pagination, onPageChange }: InvoiceTableProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
    const colors: Record<string, string> = {
        PAID: "bg-green-500",
        PARTIALLY_PAID: "bg-blue-500",
        PENDING: "bg-yellow-500",
        OVERDUE: "bg-red-500",
        CANCELLED: "bg-zinc-500",
    };
    const selectedClassColors: Record<string, string> = {
        PAID: "bg-green-100 border-green-500 border-2",
        PARTIALLY_PAID: "bg-blue-100 border-blue-500 border-2",
        PENDING: "bg-yellow-100 border-yellow-500 border-2",
        OVERDUE: "bg-red-100 border-red-500 border-2",
        CANCELLED: "bg-zinc-100 border-zinc-500 border-2",
        ALL: "bg-blue-100 border-primary border-2"
    };
    const filters = [
        {
            id: "all",
            name: "All Invoices"
        },
        {
            id: "paid",
            name: "paid"
        },
        {
            id: "overdue",
            name: "Overdue"
        },
        {
            id: "pending",
            name: "Pending"
        },
        {
            id: "partially_paid",
            name: "Partially Paid"
        }
    ]

    const router = useRouter()


    const refreshDetails = () => {
        refresh()
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
    return (
        <div>
            {
                filteredInvoices &&
                <div className="border border-[#F0F0F0] bg-white p-4 rounded-md flex flex-col gap-4">
                    <Input placeholder="Search invoices" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="lg:w-[40%]" />
                    <div className="flex items-center flex-wrap gap-4">
                        {
                            filters.map((filter) => {
                                const colorClass = colors[filter.id.toUpperCase()]
                                const selectedColorClass = selectedFilter === filter.id ? selectedClassColors[filter.id.toUpperCase()] : "bg-white"
                                return (
                                    <button key={filter.id} className={`border border-[#B3B3B3] px-3 py-2 text-xs font-medium rounded capitalize flex items-center gap-1 ${selectedColorClass}`} onClick={() => setSelectedFilter(filter.id)}>
                                        {
                                            filter.id !== "all" &&
                                            <div className={`size-2 rounded-full ${colorClass}`}></div>
                                        }
                                        <span>{filter.name}</span>
                                    </button>
                                )
                            })
                        }
                    </div>
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
                                                                        <DropdownMenuItem onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            setSelectedInvoice(invoice)
                                                                        }}>
                                                                            Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            mutate(invoice.id)
                                                                        }}>
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
                    {
                        pagination &&
                        <PaginationControls pagination={pagination} onPageChange={onPageChange} />
                    }
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