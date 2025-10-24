"use client";

import { useQuery } from "@tanstack/react-query";
import { Client } from "../types";
import { fetchClientDetails, fetchClients } from "../services";

export const useClients = () => {
  return useQuery<Client[], Error>({
    queryKey: ["clients"],
    queryFn: fetchClients,
    staleTime: 1000 * 60,
  });
};

export const useClientDetails = (id: string) => {
  return useQuery<Client, Error>({
    queryKey: ["invoice-details", id],
    queryFn: () => fetchClientDetails(id),
    staleTime: 1000 * 60,
    enabled: !!id,
  });
};
