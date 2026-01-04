"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyTableState from "@/components/shared/EmptyTableState";
import { formatDate, formatCurrency } from "@/utils";
import { usePayments } from "../hooks";
import StatusBadge from "@/features/invoice/components/StatusBadge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <Skeleton className="h-10 w-full sm:w-[300px]" />
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function PaymentsPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: payments, isLoading, isFetching, isError } = usePayments();
  const isDataLoading = isLoading || (!!payments && isFetching);

  const filteredPayments = payments?.filter((payment) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      payment.invoice?.invoiceNumber?.toLowerCase().includes(searchLower) ||
      payment.invoice?.client?.name?.toLowerCase().includes(searchLower)
    );
  });

  if (isDataLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Failed to load payments
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search by invoice number or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                <TableHead className="font-semibold">Invoice #</TableHead>
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
              </TableRow>
            </TableHeader>
            {payments && payments.length === 0 ? (
              <EmptyTableState
                colSpan={5}
                title="No Payments Found"
                description="Payments will appear here once clients start paying."
              />
            ) : payments && payments.length > 0 && filteredPayments && filteredPayments.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        No payments match your search
                      </p>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Try adjusting your search terms
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {filteredPayments?.map((payment) => {
                  const invoice = payment.invoice;
                  return (
                    <TableRow
                      key={payment.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <TableCell className="font-medium">
                        {invoice?.invoiceNumber || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {invoice?.client?.name || "N/A"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={payment.status} />
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(payment.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </div>
      </div>
    </div>
  );
}