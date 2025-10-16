"use client"

import { useEffect } from "react"
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { PlusCircle, Trash2 } from "lucide-react"
import { InvoiceFormInputs, invoiceFormSchema } from "../schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    useForm,
    Controller,
    useFieldArray,
    useWatch,
} from "react-hook-form"
import { useEditInvoice } from "../hooks/useEditInvoice"
import { useClients } from "@/features/clients/hooks/useClients"
import { formatCurrency, getErrorMessage } from "@/utils"
import CurrencyInput from "@/components/shared/CurrencyInput"
import { Invoice } from "../types"

interface NewInvoiceProps {
    closeDialog: () => void
    invoice: Invoice | null
}

export default function EditInvoice({ closeDialog, invoice }: NewInvoiceProps) {
    const {
        handleSubmit,
        reset,
        control,
        register,
        setValue,
    } = useForm<InvoiceFormInputs>({
        resolver: zodResolver(invoiceFormSchema),
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    })

    // Watch form values for calculation
    const items = useWatch({ control, name: "items" }) || []
    const tax = useWatch({ control, name: "tax" }) || 0
    const discount = useWatch({ control, name: "discount" }) || 0
    const paidAmount = useWatch({ control, name: "paidAmount" }) || 0
    const status = useWatch({ control, name: "status" })

    // Calculate totals dynamically
    useEffect(() => {
        const subtotal = items.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)
        const totalAmount = subtotal + Number(tax) - Number(discount)
        const dueAmount = totalAmount - Number(paidAmount)
        setValue("totalAmount", totalAmount)
        setValue("dueAmount", dueAmount)
        if (status === "PAID") {
            const subtotal = items.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)
            const totalAmount = subtotal + Number(tax) - Number(discount)
            setValue("paidAmount", totalAmount)
            setValue("dueAmount", 0)
        } else if (status === "PARTIALLY_PAID") {
            const subtotal = items.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)
            const totalAmount = subtotal + Number(tax) - Number(discount)
            const paid = Number(paidAmount) || 0
            setValue("dueAmount", Math.max(totalAmount - paid, 0))
        }
    }, [items, tax, discount, paidAmount, setValue, status])

    useEffect(() => {
        reset({
            items:
                invoice?.items && invoice.items.length
                    ? invoice.items.map((item) => ({
                        name: item.name || "",
                        description: item.description || undefined, // convert null to undefined
                        quantity: item.quantity || 1,
                        price: item.price || 0,
                        totalPrice: item.totalPrice || 0,
                    }))
                    : [
                        {
                            name: "",
                            description: "",
                            quantity: 1,
                            price: 0,
                            totalPrice: 0,
                        },
                    ],
            tax: invoice?.tax || 0,
            discount: invoice?.discount || 0,
            paidAmount: invoice?.paidAmount || 0,
            totalAmount: invoice?.totalAmount || 0,
            dueAmount: invoice?.dueAmount || 0,
            issueDate: invoice?.issueDate
                ? new Date(invoice.issueDate).toISOString().split("T")[0]
                : "",
            dueDate: invoice?.dueDate
                ? new Date(invoice.dueDate).toISOString().split("T")[0]
                : "",
            invoiceNumber: invoice?.invoiceNumber || "",
            status: invoice?.status || "PENDING",
            clientId: invoice?.clientId || "",
        });
    }, [invoice, reset]);


    const { data: clients } = useClients()

    const { mutate, isPending } = useEditInvoice({
        onSuccess: () => {
            toast.success("Invoice updated successfully")
            reset()
            closeDialog()
        },
        onError: (e: unknown) => {
            toast.error(getErrorMessage(e) || "Something went wrong")
        },
    })

    const addItem = () => {
        append({ name: "", description: "", quantity: 1, price: 0, totalPrice: 0 })
    }

    const onSubmit = (data: InvoiceFormInputs) => {
        const { items, tax, discount, paidAmount } = data
        const subtotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0)
        const totalAmount = subtotal + (tax || 0) - (discount || 0)
        const dueAmount = totalAmount - (paidAmount || 0)
        const payload = {
            ...data,
            totalAmount,
            dueAmount,
        }
        mutate({ id: invoice?.id || "", data: payload })
    }

    return (
        <DialogContent className="sm:max-w-[850px] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Edit Invoice</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Invoice details */}
                <FieldSet>
                    <FieldGroup className="!grid !grid-cols-1 md:!grid-cols-3 gap-2 md:gap-4">
                        <Field>
                            <FieldLabel>Invoice Number</FieldLabel>
                            <Input {...register("invoiceNumber")} readOnly />
                        </Field>
                        <Field>
                            <FieldLabel>Issue Date</FieldLabel>
                            <Input type="date" {...register("issueDate")} />
                        </Field>
                        <Field>
                            <FieldLabel>Due Date</FieldLabel>
                            <Input type="date" {...register("dueDate")} />
                        </Field>
                    </FieldGroup>
                </FieldSet>

                <FieldSet>
                    <FieldGroup className="!grid !grid-cols-1 md:!grid-cols-3 gap-2 md:gap-4">
                        <Field>
                            <FieldLabel>Client</FieldLabel>
                            <Controller
                                name="clientId"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select client" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients?.map((client) => (
                                                <SelectItem key={client.id} value={client.id}>
                                                    {client.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Status</FieldLabel>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
                                            <SelectItem value="PAID">Paid</SelectItem>
                                            <SelectItem value="OVERDUE">Overdue</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>

                {/* Items */}
                <FieldSet>
                    <FieldLabel>Items</FieldLabel>
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="grid grid-cols-2 gap-3 border p-3 rounded-md bg-muted/30"
                            >
                                <Controller
                                    name={`items.${index}.name`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input placeholder="Name" {...field} />
                                    )}
                                />
                                <Controller
                                    name={`items.${index}.quantity`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            placeholder="Qty"
                                            {...field}
                                            onChange={(e) => {
                                                const value = Number(e.target.value)
                                                field.onChange(value)
                                                const price = items[index]?.price || 0
                                                setValue(`items.${index}.totalPrice`, value * price)
                                            }}
                                        />
                                    )}
                                />
                                <Controller
                                    name={`items.${index}.price`}
                                    control={control}
                                    render={({ field }) => (
                                        <CurrencyInput
                                            type="number"
                                            placeholder="Price"
                                            {...field}
                                            onChange={(e) => {
                                                const value = Number(e.target.value)
                                                field.onChange(value)
                                                const qty = items[index]?.quantity || 0
                                                setValue(`items.${index}.totalPrice`, qty * value)
                                            }}
                                        />
                                    )}
                                />
                                <p className="text-sm h-10 flex items-center">
                                    Total Price:
                                    <span className="font-medium ml-1">
                                        {formatCurrency(Number((items[index]?.totalPrice || 0).toFixed(2)))}
                                    </span>
                                </p>
                                <div className="flex items-center justify-between">
                                    <Controller
                                        name={`items.${index}.description`}
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea placeholder="Description" className="max-h-[100px]" {...field} />
                                        )}
                                    />
                                    {fields.length > 0 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="h-4 w-4 text-error" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addItem}
                            className="flex items-center gap-2"
                        >
                            <PlusCircle className="h-4 w-4" /> Add Item
                        </Button>
                    </div>
                </FieldSet>

                {/* Totals */}
                <FieldSet>
                    <FieldGroup className="!grid !grid-cols-3 gap-4">
                        <Field>
                            <FieldLabel>Tax</FieldLabel>
                            <CurrencyInput type="number" placeholder="0" {...register("tax", { valueAsNumber: true })} />
                        </Field>
                        <Field>
                            <FieldLabel>Discount</FieldLabel>
                            <CurrencyInput type="number" placeholder="0" {...register("discount", { valueAsNumber: true })} />
                        </Field>
                        <Field>
                            <FieldLabel>Total</FieldLabel>
                            <CurrencyInput {...register("totalAmount", { valueAsNumber: true })} readOnly />
                        </Field>
                    </FieldGroup>
                </FieldSet>

                <DialogFooter className="flex justify-end gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Spinner />}
                        <span>Save Changes</span>
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}
