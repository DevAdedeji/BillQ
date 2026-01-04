import { Invoice } from "@/features/invoice/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditInvoice from "./EditInvoice";
import EmptyTableState from "@/components/shared/EmptyTableState";
import { useRouter } from "next/navigation";
import { EllipsisVertical, Search } from "lucide-react";
import { getErrorMessage, formatDate, formatCurrency } from "@/utils";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteInvoice } from "../hooks/useDeleteInvoice";
import StatusBadge from "./StatusBadge";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { cn } from "@/lib/utils";

interface InvoiceTableProps {
  invoices: Invoice[];
  selectedFilter: string;
  setSelectedFilter: (id: string) => void;
  refresh: () => void;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalInvoices: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
}

const FILTERS = [
  { id: "all", name: "All Invoices", color: null },
  { id: "paid", name: "Paid", color: "bg-green-500" },
  { id: "overdue", name: "Overdue", color: "bg-red-500" },
  { id: "pending", name: "Pending", color: "bg-yellow-500" },
  { id: "partially_paid", name: "Partially Paid", color: "bg-blue-500" },
];

const FILTER_COLORS: Record<string, string> = {
  paid: "bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  overdue: "bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  pending: "bg-yellow-100 border-yellow-500 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  partially_paid: "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  all: "bg-primary/10 border-primary text-primary dark:bg-primary/20",
};

export default function InvoiceTable({
  invoices,
  selectedFilter,
  setSelectedFilter,
  refresh,
  pagination,
  onPageChange,
}: InvoiceTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const router = useRouter();

  const { mutate, isPending } = useDeleteInvoice({
    onSuccess: () => {
      toast.success("Invoice deleted successfully");
      refresh();
      setOpenDropdownId(null);
    },
    onError: (err: unknown) => {
      const message = getErrorMessage(err);
      toast.error(message || "Something went wrong");
      setOpenDropdownId(null);
    },
  });

  const goToInvoicePage = (id: string) => {
    router.push(`/dashboard/invoices/${id}`);
  };

  const filteredInvoices = invoices?.filter(
    (invoice: Invoice) =>
      (invoice.invoiceNumber ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (invoice.client?.name ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search by invoice number or client name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 lg:w-[40%]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((filter) => {
          const isActive = selectedFilter === filter.id;
          const colorClass = isActive ? FILTER_COLORS[filter.id] : "";

          return (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                "hover:bg-gray-50 dark:hover:bg-gray-800",
                isActive
                  ? `border-2 ${colorClass}`
                  : "border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              )}
            >
              {filter.color && (
                <div className={cn("h-2 w-2 rounded-full", filter.color)} />
              )}
              <span className="capitalize">{filter.name}</span>
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
              <TableHead className="font-semibold">Invoice #</TableHead>
              <TableHead className="font-semibold">Due Date</TableHead>
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Paid</TableHead>
              <TableHead className="font-semibold">Due</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          {invoices && invoices.length === 0 ? (
            <EmptyTableState
              colSpan={8}
              title="No Invoices Found"
              description="Get started by creating your first invoice."
            />
          ) : invoices && invoices.length > 0 && filteredInvoices.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      No invoices match your search
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
              {filteredInvoices.map((invoice) => (
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
                  <TableCell className="font-medium">
                    {invoice.client?.name || "N/A"}
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
                  <TableCell className="text-right">
                    <DropdownMenu
                      open={openDropdownId === invoice.id}
                      onOpenChange={(isOpen) => {
                        if (!isPending)
                          setOpenDropdownId(isOpen ? invoice.id : null);
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => e.stopPropagation()}
                          className="h-8 w-8"
                        >
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInvoice(invoice);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              mutate(invoice.id);
                            }}
                            className="text-red-600 focus:text-red-600"
                          >
                            {isPending && <Spinner className="mr-2" />}
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>

      {pagination && (
        <PaginationControls pagination={pagination} onPageChange={onPageChange} />
      )}

      <Dialog
        open={!!selectedInvoice}
        onOpenChange={() => setSelectedInvoice(null)}
      >
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <EditInvoice
          closeDialog={() => {
            refresh();
            setSelectedInvoice(null);
          }}
          invoice={selectedInvoice}
        />
      </Dialog>
    </div>
  );
}