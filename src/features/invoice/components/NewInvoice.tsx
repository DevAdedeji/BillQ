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
import { useNewInvoice } from "../hooks/useNewInvoice"
import { useClients } from "@/features/clients/hooks/useClients"
import { formatCurrency, getErrorMessage } from "@/utils"
import CurrencyInput from "@/components/shared/CurrencyInput"

interface NewInvoiceProps {
    closeDialog: () => void
}

export default function NewInvoice({ closeDialog }: NewInvoiceProps) {
    const {
        handleSubmit,
        reset,
        control,
        register,
        setValue,
    } = useForm<InvoiceFormInputs>({
        resolver: zodResolver(invoiceFormSchema),
        defaultValues: {
            items: [{ name: "", description: "", quantity: 1, price: 0, totalPrice: 0 }],
            tax: 0,
            discount: 0,
            paidAmount: 0,
            totalAmount: 0,
            dueAmount: 0,
            issueDate: new Date().toISOString().split("T")[0],
            invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
            status: "PENDING",
        },
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

    // Calculate totals dynamically
    useEffect(() => {
        const subtotal = items.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)
        const totalAmount = subtotal + Number(tax) - Number(discount)
        const dueAmount = totalAmount - Number(paidAmount)

        setValue("totalAmount", totalAmount)
        setValue("dueAmount", dueAmount)
    }, [items, tax, discount, paidAmount, setValue])

    const { data: clients } = useClients()

    const { mutate, isPending } = useNewInvoice({
        onSuccess: () => {
            toast.success("Invoice created successfully")
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
        mutate(payload)
    }

    return (
        <DialogContent className="sm:max-w-[850px] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Create Invoice</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Invoice details */}
                <FieldSet>
                    <FieldGroup className="!grid !grid-cols-1 md:!grid-cols-3 gap-2 md:!gap-4">
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
                    <FieldGroup className="!grid !grid-cols-1 md:!grid-cols-3 gap-2 md:!gap-4">
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
                                className="grid grid-cols-1 md:grid-cols-2 gap-3 border p-3 rounded-md bg-muted/30"
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
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                                            <Textarea placeholder="Description" {...field} />
                                        )}
                                    />
                                    {fields.length > 1 && (
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
                    <FieldGroup className="!grid !grid-cols-1 md:!grid-cols-3 gap-2 md:gap-4">
                        <Field>
                            <FieldLabel>Tax</FieldLabel>
                            <CurrencyInput type="number" placeholder="0" {...register("tax", { valueAsNumber: true })} />
                        </Field>
                        <Field>
                            <FieldLabel>Discount</FieldLabel>
                            <CurrencyInput type="number" placeholder="0" {...register("discount", { valueAsNumber: true })} />
                        </Field>
                        <Field>
                            <FieldLabel>Paid Amount</FieldLabel>
                            <CurrencyInput type="number" placeholder="0" {...register("paidAmount", { valueAsNumber: true })} />
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
                        <span>Save</span>
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}
