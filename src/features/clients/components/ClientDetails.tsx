"use client";

import { useClientDetails } from "../hooks/useClients";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
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
import { getErrorMessage, formatDate, formatCurrency } from "@/utils";
import { Button } from "@/components/ui/button";
import EditClient from "./EditClient";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EmptyTableState from "@/components/shared/EmptyTableState";
import StatusBadge from "@/features/invoice/components/StatusBadge";

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 py-8 px-4 lg:px-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[80%] lg:w-[40%] bg-slate-200" />
        <Skeleton className="w-10 lg:w-20 h-6 bg-slate-200" />
      </div>
      <Skeleton className="w-full h-10 bg-slate-200" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="grid grid-cols-3 gap-2">
          <Skeleton className="h-10 bg-slate-200" />
          <Skeleton className="h-10 bg-slate-200" />
          <Skeleton className="h-10 bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export default function ClientDetails({ id }: { id: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: client, isPending, refetch } = useClientDetails(id);

  const refreshDetails = () => {
    setIsDialogOpen(false);
    refetch();
  };

  const router = useRouter();

  const goToInvoicePage = (id: string) => {
    router.push(`/dashboard/invoices/${id}`);
  };

  if (isPending) return <LoadingSkeleton />;

  if (client) {
    const invoices = client?.invoices;
    return (
      <div className="flex flex-col gap-8 px-4 py-8 lg:p-8">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/clients" className="flex items-center gap-1">
            <ArrowLeft />
            <p>Back</p>
          </Link>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Edit Client</Button>
            </DialogTrigger>
            <EditClient
              closeDialog={() => {
                refreshDetails();
              }}
              client={client}
            />
          </Dialog>
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold">Company/Brand Name</h2>
            <p className="text-sm">{client.name}</p>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold">Company/Brand Email</h2>
            <p className="text-sm">{client.email}</p>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold">Company/Brand Address</h2>
            <p className="text-sm">{client.address}</p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead>Invoice Number</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Paid Amount</TableHead>
              <TableHead>Due Amount</TableHead>
              <TableHead>Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          {invoices && invoices.length === 0 && (
            <EmptyTableState
              colSpan={8}
              title="No Invoices Found"
              description="Looks like you haven't created any invoices yet. Get started by creating your first one."
            />
          )}
          {invoices && invoices.length > 0 && (
            <TableBody>
              {invoices.map((invoice) => {
                return (
                  <TableRow
                    key={invoice.id}
                    className="hover:bg-slate-50"
                    onClick={() => goToInvoicePage(invoice.id)}
                  >
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatDate(invoice.dueDate)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {invoice.client.name}
                    </TableCell>
                    <TableCell className="font-medium">
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
                );
              })}
            </TableBody>
          )}
        </Table>
      </div>
    );
  }
}
