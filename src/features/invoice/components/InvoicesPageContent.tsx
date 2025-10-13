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
import { EllipsisVertical } from "lucide-react"
import { useState } from "react"
import { getErrorMessage } from "@/utils"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

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
    const [searchQuery, setSearchQuery] = useState("")
    const refreshDetails = () => {

    }
    return (
        <div className="flex flex-col gap-6 px-4 py-8 lg:p-8">
            <div className="flex items-center justify-between gap-2">
                <Input placeholder="Search invoices" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="lg:w-[40%]" />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>New Client</Button>
                    </DialogTrigger>
                    <NewInvoice closeDialog={refreshDetails} />
                </Dialog>
            </div>
        </div>
    )
}