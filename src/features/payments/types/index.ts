import { Invoice } from "@/features/invoice/types";

export interface Payment {
  invoice: Invoice;
  id: string;
  userId: string;
  invoiceId: string;
  stripeSessionId: string;
  amount: number;
  status: string;
  metadata: string;
  createdAt: string | Date;
}
