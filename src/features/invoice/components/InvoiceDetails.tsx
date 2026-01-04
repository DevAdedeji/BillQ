"use client";

import { useInvoiceDetails } from "@/features/invoice/hooks/useInvoice";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Eye, Share2, Edit } from "lucide-react";
import { formatDate, formatCurrency, copyToClipboard } from "@/utils";
import Link from "next/link";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import StatusBadge from "./StatusBadge";
import { Button } from "@/components/ui/button";
import EditInvoice from "./EditInvoice";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-20" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

interface InfoCardProps {
  label: string;
  value: React.ReactNode;
}

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </h3>
      <div className="text-base font-semibold text-gray-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}

export default function InvoiceDetails({ id }: { id: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: invoice, isPending, refetch } = useInvoiceDetails(id);

  const router = useRouter();

  const goToPreviewPage = () => {
    if (invoice) {
      router.push(`/dashboard/invoices/${invoice.id}/preview`);
    }
  };

  const copyLink = () => {
    if (invoice) {
      copyToClipboard(
        `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoice.id}`,
      );
      toast.success("Link copied to clipboard");
    }
  };

  const refreshDetails = () => {
    setIsDialogOpen(false);
    refetch();
  };

  if (isPending) return <LoadingSkeleton />;

  if (!invoice) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Invoice not found
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            The invoice you're looking for doesn't exist
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/dashboard/invoices"
          className={cn(
            "inline-flex w-fit items-center gap-2 text-sm font-medium text-gray-700 transition-colors",
            "hover:text-primary dark:text-gray-300 dark:hover:text-primary"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Invoices</span>
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={goToPreviewPage}>
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            </DialogTrigger>
            <EditInvoice closeDialog={refreshDetails} invoice={invoice} />
          </Dialog>
          <Button variant="outline" onClick={copyLink}>
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard label="Invoice Number" value={invoice.invoiceNumber} />
        <InfoCard label="Issue Date" value={formatDate(invoice.issueDate)} />
        <InfoCard label="Due Date" value={formatDate(invoice.dueDate)} />
        <InfoCard label="Client" value={invoice.client?.name || "N/A"} />
        <InfoCard label="Status" value={<StatusBadge status={invoice.status} />} />
        <InfoCard
          label="Paid Amount"
          value={formatCurrency(invoice.paidAmount)}
        />
        <InfoCard label="Due Amount" value={formatCurrency(invoice.dueAmount)} />
        <InfoCard
          label="Total Amount"
          value={formatCurrency(invoice.totalAmount)}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Invoice Items
        </h2>
        {invoice.items && invoice.items.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {invoice.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Item Name
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {item.name}
                  </p>
                </div>
                {item.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Description
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Quantity
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Price
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Total
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-12 dark:border-gray-800 dark:bg-gray-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No items found for this invoice
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
