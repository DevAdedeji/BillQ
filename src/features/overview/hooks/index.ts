"use client"

import { useQuery } from "@tanstack/react-query";
import { Overview } from "../types";
import { fetchOverview } from "../services";

export const useFetchOverview = () => {
    return useQuery<Overview, Error>({
        queryKey: ["overview"],
        queryFn: fetchOverview,
        staleTime: 1000 * 60
    })
}