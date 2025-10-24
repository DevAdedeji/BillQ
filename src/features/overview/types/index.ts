import { Invoice } from "@/features/invoice/types";
import { Payment } from "@/features/payments/types";

export interface Overview {
  invoices: Invoice[];
  payments: Payment[];
  totalInvoices: number;
  totalClients: number;
  totalEarned: number;
  totalDue: number;
}
