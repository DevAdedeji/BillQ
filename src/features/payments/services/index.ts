import { Payment } from "../types";

export const fetchPayments = async (): Promise<Payment[]> => {
  const res = await fetch("/api/pay", { cache: "no-store" });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch payments");
  }
  const data = await res.json();
  return data.data as Payment[];
};
