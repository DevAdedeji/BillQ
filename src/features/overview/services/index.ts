import { Overview } from "../types";

export const fetchOverview = async (): Promise<Overview> => {
  const res = await fetch("/api/overview", { cache: "no-store" });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch invoices");
  }
  const data = await res.json();
  return data as Overview;
};
