import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import NewInvoice from "@/features/invoice/components/NewInvoice"

export const metadata = {
    title: "Create Invoice | BillQ Dashboard",
    description: "Manage and send invoices easily with BillQ.",
}

export default function CreateInvoicePage() {
    return (
        <div className="flex flex-col gap-8 px-4 py-8 lg:p-6">
            <Link href="/dashboard/invoices" className="flex items-center gap-1">
                <ArrowLeft />
                <p>Back</p>
            </Link>
            <NewInvoice />
        </div>
    )
}