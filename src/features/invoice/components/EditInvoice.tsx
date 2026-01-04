"use client";

import { useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { PlusCircle, Trash2 } from "lucide-react";
import { InvoiceFormInputs, invoiceFormSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { useEditInvoice } from "../hooks/useEditInvoice";
import { useClients } from "@/features/clients/hooks/useClients";
import { formatCurrency, getErrorMessage } from "@/utils";
import CurrencyInput from "@/components/ui/currency-input";
import { Invoice } from "../types";
import { cn } from "@/lib/utils";

interface EditInvoiceProps {
  closeDialog: () => void;
  invoice: Invoice | null;
}

export default function EditInvoice({ closeDialog, invoice }: EditInvoiceProps) {
  const { handleSubmit, reset, control, register, setValue } =
    useForm<InvoiceFormInputs>({
      resolver: zodResolver(invoiceFormSchema),
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = useWatch({ control, name: "items" }) || [];
  const tax = useWatch({ control, name: "tax" }) || 0;
  const discount = useWatch({ control, name: "discount" }) || 0;
  const paidAmount = useWatch({ control, name: "paidAmount" }) || 0;
  const status = useWatch({ control, name: "status" });

  useEffect(() => {
    const subtotal = items.reduce(
      (acc, curr) => acc + (curr.totalPrice || 0),
      0,
    );
    const totalAmount = subtotal + Number(tax) - Number(discount);
    const dueAmount = totalAmount - Number(paidAmount);
    setValue("totalAmount", totalAmount);
    setValue("dueAmount", dueAmount);

    if (status === "PAID") {
      setValue("paidAmount", totalAmount);
      setValue("dueAmount", 0);
    } else if (status === "PARTIALLY_PAID") {
      const paid = Number(paidAmount) || 0;
      setValue("dueAmount", Math.max(totalAmount - paid, 0));
    }
  }, [items, tax, discount, paidAmount, setValue, status]);

  useEffect(() => {
    reset({
      items:
        invoice?.items && invoice.items.length
          ? invoice.items.map((item) => ({
              name: item.name || "",
              description: item.description || undefined,
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

  const { data: clients } = useClients();

  const { mutate, isPending } = useEditInvoice({
    onSuccess: () => {
      toast.success("Invoice updated successfully");
      reset();
      closeDialog();
    },
    onError: (e: unknown) => {
      toast.error(getErrorMessage(e) || "Something went wrong");
    },
  });

  const addItem = () => {
    append({ name: "", description: "", quantity: 1, price: 0, totalPrice: 0 });
  };

  const onSubmit = (data: InvoiceFormInputs) => {
    const { items, tax, discount, paidAmount } = data;
    const subtotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const totalAmount = subtotal + (tax || 0) - (discount || 0);
    const dueAmount = totalAmount - (paidAmount || 0);
    const payload = {
      ...data,
      totalAmount,
      dueAmount,
    };
    mutate({ id: invoice?.id || "", data: payload });
  };

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>Edit Invoice</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            Invoice Details
          </h3>
          <FieldSet>
            <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            Client Information
          </h3>
          <FieldSet>
            <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        <SelectItem value="PARTIALLY_PAID">
                          Partially Paid
                        </SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="OVERDUE">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Invoice Items
          </h3>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Controller
                    name={`items.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="Item name" {...field} />
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel>Quantity</FieldLabel>
                  <Controller
                    name={`items.${index}.quantity`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="1"
                        {...field}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          field.onChange(value);
                          const price = items[index]?.price || 0;
                          setValue(`items.${index}.totalPrice`, value * price);
                        }}
                      />
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel>Price</FieldLabel>
                  <Controller
                    name={`items.${index}.price`}
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        type="number"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          field.onChange(value);
                          const qty = items[index]?.quantity || 0;
                          setValue(`items.${index}.totalPrice`, qty * value);
                        }}
                      />
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel>Total</FieldLabel>
                  <div className="flex h-10 items-center rounded-md border border-gray-200 bg-gray-100 px-3 text-sm font-semibold dark:border-gray-800 dark:bg-gray-900">
                    {formatCurrency(items[index]?.totalPrice || 0)}
                  </div>
                </Field>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Controller
                    name={`items.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        placeholder="Item description"
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    )}
                  />
                </Field>
                {fields.length > 1 && (
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Item</span>
          </Button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            Payment Details
          </h3>
          <FieldSet>
            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field>
                <FieldLabel>Tax</FieldLabel>
                <CurrencyInput
                  type="number"
                  placeholder="0.00"
                  {...register("tax", { valueAsNumber: true })}
                />
              </Field>
              <Field>
                <FieldLabel>Discount</FieldLabel>
                <CurrencyInput
                  type="number"
                  placeholder="0.00"
                  {...register("discount", { valueAsNumber: true })}
                />
              </Field>
              <Field>
                <FieldLabel>Paid Amount</FieldLabel>
                <CurrencyInput
                  type="number"
                  placeholder="0.00"
                  {...register("paidAmount", { valueAsNumber: true })}
                />
              </Field>
              <Field>
                <FieldLabel>Total</FieldLabel>
                <CurrencyInput
                  {...register("totalAmount", { valueAsNumber: true })}
                  readOnly
                  className="font-semibold"
                />
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner className="mr-2" />}
            <span>Save Changes</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}