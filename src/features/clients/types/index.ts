import { Invoice } from "@/features/invoice/types";

export interface Client {
  id: string;
  name: string;
  email: string;
  address?: string | null;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  invoices?: Invoice[];
}
