"use client";

import { useClientDetails } from "../hooks/useClients";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { formatDate, formatCurrency } from "@/utils";
import { Button } from "@/components/ui/button";
import EditClient from "./EditClient";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EmptyTableState from "@/components/shared/EmptyTableState";
import StatusBadge from "@/features/invoice/components/StatusBadge";
import { cn } from "@/lib/utils";

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

interface InfoCardProps {
  label: string;
  value: string;
}

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </h3>
      <p className="text-base font-semibold text-gray-900 dark:text-white">
        {value || "N/A"}
      </p>
    </div>
  );
}

export default function ClientDetails({ id }: { id: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: client, isPending, refetch } = useClientDetails(id);

  const router = useRouter();

  const refreshDetails = () => {
    setIsDialogOpen(false);
    refetch();
  };

  const goToInvoicePage = (id: string) => {
    router.push(`/dashboard/invoices/${id}`);
  };

  if (isPending) return <LoadingSkeleton />;

  if (!client) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Client not found
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            The client you're looking for doesn't exist
          </p>
        </div>
      </div>
    );
  }

  const invoices = client?.invoices || [];

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/dashboard/clients"
          className={cn(
            "inline-flex w-fit items-center gap-2 text-sm font-medium text-gray-700 transition-colors",
            "hover:text-primary dark:text-gray-300 dark:hover:text-primary"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Clients</span>
        </Link>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Edit className="h-4 w-4" />
              <span>Edit Client</span>
            </Button>
          </DialogTrigger>
          <EditClient closeDialog={refreshDetails} client={client} />
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard label="Client Name" value={client.name} />
        <InfoCard label="Email Address" value={client.email} />
        <InfoCard label="Address" value={client.address ?? ''} />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Client Invoices
        </h2>
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                  <TableHead className="font-semibold">Invoice #</TableHead>
                  <TableHead className="font-semibold">Due Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Paid</TableHead>
                  <TableHead className="font-semibold">Due</TableHead>
                  <TableHead className="font-semibold">Total</TableHead>
                </TableRow>
              </TableHeader>
              {invoices.length === 0 ? (
                <EmptyTableState
                  colSpan={6}
                  title="No Invoices Found"
                  description="This client doesn't have any invoices yet."
                />
              ) : (
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      onClick={() => goToInvoicePage(invoice.id)}
                    >
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(invoice.dueDate)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={invoice.status} />
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(invoice.paidAmount)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(invoice.dueAmount)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(invoice.totalAmount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}