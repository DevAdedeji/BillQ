"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useFetchOverview } from "../hooks";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyTableState from "@/components/shared/EmptyTableState";
import { formatDate, formatCurrency } from "@/utils";
import StatusBadge from "@/features/invoice/components/StatusBadge";
import {
  TriangleAlert,
  CircleDollarSign,
  Users,
  ScrollText,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[150px] rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            {[...Array(3)].map((_, j) => (
              <Skeleton key={j} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
  title: string;
  value: string | number;
}

function StatCard({ icon: Icon, iconBgColor, iconColor, title, value }: StatCardProps) {
  return (
    <div className="flex h-[150px] flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-full", iconBgColor, iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
      </div>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white lg:text-3xl">
        {value}
      </p>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  href: string;
  linkText: string;
}

function SectionHeader({ title, href, linkText }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      <Link
        href={href}
        className="group flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
      >
        <span>{linkText}</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

// Main Component
export default function OverviewPageContent() {
  const { data, isLoading, isFetching, isError } = useFetchOverview();
  const isDataLoading = isLoading || (!!data && isFetching);
  const router = useRouter();

  const goToInvoicePage = (id: string) => {
    router.push(`/dashboard/invoices/${id}`);
  };

  if (isDataLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            Failed to load overview data
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: CircleDollarSign,
      iconBgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      title: "Total Earned",
      value: formatCurrency(data?.totalEarned),
    },
    {
      icon: TriangleAlert,
      iconBgColor: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
      title: "Total Due",
      value: formatCurrency(data?.totalDue),
    },
    {
      icon: ScrollText,
      iconBgColor: "bg-gray-100 dark:bg-gray-800",
      iconColor: "text-gray-600 dark:text-gray-400",
      title: "Total Invoices",
      value: data?.totalInvoices || 0,
    },
    {
      icon: Users,
      iconBgColor: "bg-gray-100 dark:bg-gray-800",
      iconColor: "text-gray-600 dark:text-gray-400",
      title: "Total Clients",
      value: data?.totalClients || 0,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white lg:text-3xl">
          Welcome back!
        </h1>
        <Link
          href="/dashboard/invoices/create"
          className={cn(
            "inline-flex h-10 w-fit items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white",
            "transition-colors hover:bg-primary/90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          )}
        >
          <Plus className="h-4 w-4" />
          <span>New Invoice</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <SectionHeader
            title="Latest Invoices"
            href="/dashboard/invoices"
            linkText="View all"
          />

          <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-800">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                  <TableHead className="font-semibold">Client</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Paid</TableHead>
                  <TableHead className="font-semibold">Due</TableHead>
                </TableRow>
              </TableHeader>
              {data?.invoices && data.invoices.length === 0 ? (
                <EmptyTableState
                  colSpan={4}
                  title="No Invoices Found"
                  description="Get started by creating your first invoice."
                />
              ) : (
                <TableBody>
                  {data?.invoices.map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      onClick={() => goToInvoicePage(invoice.id)}
                    >
                      <TableCell className="font-medium">
                        {invoice.client.name}
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
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <SectionHeader
            title="Latest Payments"
            href="/dashboard/invoices"
            linkText="View all"
          />

          <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-800">
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
              {data?.payments && data.payments.length === 0 ? (
                <EmptyTableState
                  colSpan={5}
                  title="No Payments Found"
                  description="Payments will appear here once clients start paying."
                />
              ) : (
                <TableBody>
                  {data?.payments.map((payment) => {
                    const invoice = payment.invoice;
                    return (
                      <TableRow
                        key={payment.id}
                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <TableCell className="font-medium">
                          {invoice.invoiceNumber || "N/A"}
                        </TableCell>
                        <TableCell>{invoice.client.name || "N/A"}</TableCell>
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
    </div>
  );
}