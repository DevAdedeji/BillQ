import {
  ScrollText,
  CircleDollarSign,
  TriangleAlert,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Stats {
  totalInvoices: number;
  pendingInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
}

interface StatCardProps {
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
  title: string;
  value: number;
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

export default function InvoiceStats({
  totalInvoices,
  pendingInvoices,
  paidInvoices,
  overdueInvoices,
}: Stats) {
  const stats = [
    {
      icon: ScrollText,
      iconBgColor: "bg-gray-100 dark:bg-gray-800",
      iconColor: "text-gray-600 dark:text-gray-400",
      title: "Total Invoices",
      value: totalInvoices,
    },
    {
      icon: CircleDollarSign,
      iconBgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      title: "Paid Invoices",
      value: paidInvoices,
    },
    {
      icon: Clock,
      iconBgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      title: "Pending Invoices",
      value: pendingInvoices,
    },
    {
      icon: TriangleAlert,
      iconBgColor: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
      title: "Overdue Invoices",
      value: overdueInvoices,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}