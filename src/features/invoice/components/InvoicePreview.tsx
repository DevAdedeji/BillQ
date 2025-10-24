"use client";

import { useInvoiceDetails } from "@/features/invoice/hooks/useInvoice";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Share2 } from "lucide-react";
import {
  getErrorMessage,
  formatDate,
  formatCurrency,
  copyToClipboard,
} from "@/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/session";
import { printPDF } from "@/utils/printPDF";
import { toast } from "sonner";

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

export default function InvoicePreview({ id }: { id: string }) {
  const { data: invoice, isPending } = useInvoiceDetails(id);
  const { user, isLoading } = useCurrentUser();

  const handleDownloadPDF = async () => {
    printPDF("print-area");
  };

  const copyLink = () => {
    if (invoice) {
      copyToClipboard(`${process.env.NEXT_PUBLIC_APP_URL}/${invoice.id}`);
      toast.success("Copied successfully");
    }
  };

  if (isPending || isLoading) return <LoadingSkeleton />;

  if (invoice && user)
    return (
      <div className="overflow-hidden flex flex-col gap-8 px-4 py-8 lg:p-8">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/invoices" className="flex items-center gap-1">
            <ArrowLeft />
            <p>Back</p>
          </Link>
          <div className="flex items-center gap-2">
            <Button onClick={() => handleDownloadPDF()}>Download PDF</Button>
            <Button variant={"outline"} onClick={() => copyLink()}>
              <Share2 />
              <span className="hidden md:block">Copy</span>
            </Button>
          </div>
        </div>
        <p className="block lg:hidden text-center font-semibold">
          Please view using a larger screen for better viewing
        </p>
        <div className="flex items-center justify-center w-[80%] mx-auto">
          <div
            id="print-area"
            className="w-full bg-white shadow-2xl border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-2xl">Invoice</h1>
              <h1 className="font-bold text-2xl">
                {" "}
                {user.brandName || user.name}{" "}
              </h1>
            </div>
            <div className="mt-10 flex flex-col gap-1 text-base">
              <p>
                <span className="font-bold">Invoice#: </span>
                {invoice.invoiceNumber}
              </p>
              <p>
                <span className="font-bold">Invoice Date: </span>
                {formatDate(invoice.issueDate)}
              </p>
              <p>
                <span className="font-bold">Due Date: </span>
                {formatDate(invoice.dueDate)}
              </p>
              <p className="capitalize">
                <span className="font-bold">Payment Status: </span>
                {invoice.status}
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 bg-muted/50 rounded-md p-4">
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold">Billed By</h2>
                <p>{user.brandName || user.name}</p>
                <p>{user.brandEmail || user.email}</p>
                <p>{user.brandAddress}</p>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold">Billed To</h2>
                <p>{invoice.client.name}</p>
                <p>{invoice.client.email}</p>
                <p>{invoice.client.address}</p>
              </div>
            </div>
            <div className="mt-10">
              <table className="w-full">
                <thead className="!bg-black text-white h-10">
                  <tr>
                    <th className="text-left pl-2">Item Name/Description</th>
                    <th className="text-left">Qty</th>
                    <th className="text-left">Price</th>
                    <th className="text-right pr-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items &&
                    invoice.items.length > 0 &&
                    invoice.items.map((item) => (
                      <tr key={item.id} className="min-h-10 border-b">
                        <td className="pl-2 py-2">
                          <p>{item.name}</p>
                          <p className="mt-2 text-sm max-w-[400px]">
                            {item.description}
                          </p>
                        </td>
                        <td>{item.quantity}</td>
                        <td className="py-2">{formatCurrency(item.price)}</td>
                        <td className="pr-2 py-2 text-right">
                          {formatCurrency(item.totalPrice)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="mt-10 grid grid-cols-4 gap-4">
              <div>
                <p>Tax</p>
                <p className="font-semibold">{formatCurrency(invoice.tax)}</p>
              </div>
              <div>
                <p>Discount</p>
                <p className="font-semibold">
                  {formatCurrency(invoice.discount)}
                </p>
              </div>
              <div>
                <p>Due Amount</p>
                <p className="font-semibold">
                  {formatCurrency(invoice.dueAmount)}
                </p>
              </div>
              <div>
                <p>Paid Amount</p>
                <p className="font-semibold">
                  {formatCurrency(invoice.paidAmount)}
                </p>
              </div>
              <div>
                <p>Total Amount</p>
                <p className="font-semibold">
                  {formatCurrency(invoice.totalAmount)}
                </p>
              </div>
            </div>
            {user.terms && (
              <div className="mt-10">
                <p>Terms</p>
                <p className="font-semibold">{user.terms}</p>
              </div>
            )}
            {user.note && (
              <div className="mt-10">
                <p>Note</p>
                <p className="font-semibold">{user.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
}
