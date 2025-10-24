import { z } from "zod";

export const invoiceItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  quantity: z
    .number({
      error: () => "Quantity must be a number",
    })
    .min(1, "Quantity must be at least 1"),
  price: z
    .number({
      error: () => "Price must be a number",
    })
    .min(0, "Price cannot be negative"),
  totalPrice: z
    .number({
      error: () => "Total price must be a number",
    })
    .min(0, "Total price cannot be negative"),
});

export const invoiceFormSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  invoiceNumber: z.string().min(1, "Invoice number required"),
  issueDate: z
    .string()
    .min(1, { message: "Issue date is required" })
    .transform((date) => new Date(date).toISOString()),
  dueDate: z
    .string()
    .min(1, { message: "Due date is required" })
    .transform((date) => new Date(date).toISOString()),
  status: z.enum(["PENDING", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED"]),
  tax: z
    .number({
      error: () => "Tax must be a number",
    })
    .min(0)
    .optional(),
  discount: z
    .number({
      error: () => "Discount must be a number",
    })
    .min(0)
    .optional(),
  paidAmount: z
    .number({
      error: () => "Paid amount must be a number",
    })
    .min(0)
    .optional(),
  totalAmount: z
    .number({
      error: () => "Total amount must be a number",
    })
    .min(0),
  dueAmount: z
    .number({
      error: () => "Due amount must be a number",
    })
    .min(0)
    .optional(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
});

export type InvoiceFormInputs = z.infer<typeof invoiceFormSchema>;
