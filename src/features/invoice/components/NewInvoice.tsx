"use client"

import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getErrorMessage } from "@/utils"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

interface NewInvoiceProps {
    closeDialog: () => void
}

export default function NewInvoice({ closeDialog }: NewInvoiceProps) {
    return (
        <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
                <DialogTitle>Create Invoice</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">

            </form>
        </DialogContent>
    )
}