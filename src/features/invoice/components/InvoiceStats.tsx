import {
  ScrollText,
  CircleDollarSign,
  TriangleAlert,
  Clock,
} from "lucide-react";
interface Stats {
  totalInvoices: number;
  pendingInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
}
export default function InvoiceStats({
  totalInvoices,
  pendingInvoices,
  paidInvoices,
  overdueInvoices,
}: Stats) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="border border-[#F0F0F0] bg-white h-[150px] flex flex-col justify-between p-4 rounded-md">
        <div className="flex items-center gap-1">
          <div className="size-11 rounded-full bg-[#F4F4F4] text-[#5A5A5A] flex items-center justify-center">
            <ScrollText size={24} />
          </div>
          <h2 className="font-medium text-sm text-[#5A5A5A]">Total Invoices</h2>
        </div>
        <p className="text-black text-xl lg:text-2xl font-semibold">
          {totalInvoices}
        </p>
      </div>
      <div className="border border-[#F0F0F0] bg-white h-[150px] flex flex-col justify-between p-4 rounded-md">
        <div className="flex items-center gap-1">
          <div className="size-11 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <CircleDollarSign size={24} />
          </div>
          <h2 className="font-medium text-sm text-[#5A5A5A]">Paid Invoices</h2>
        </div>
        <p className="text-black text-xl lg:text-2xl font-semibold">
          {paidInvoices}
        </p>
      </div>
      <div className="border border-[#F0F0F0] bg-white h-[150px] flex flex-col justify-between p-4 rounded-md">
        <div className="flex items-center gap-1">
          <div className="size-11 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <h2 className="font-medium text-sm text-[#5A5A5A]">
            Pending Invoices
          </h2>
        </div>
        <p className="text-black text-xl lg:text-2xl font-semibold">
          {pendingInvoices}
        </p>
      </div>
      <div className="border border-[#F0F0F0] bg-white h-[150px] flex flex-col justify-between p-4 rounded-md">
        <div className="flex items-center gap-1">
          <div className="size-11 rounded-full bg-[#FDECEC] text-red-600 flex items-center justify-center">
            <TriangleAlert size={24} />
          </div>
          <h2 className="font-medium text-sm text-[#5A5A5A]">
            Overdue Invoices
          </h2>
        </div>
        <p className="text-black text-xl lg:text-2xl font-semibold">
          {overdueInvoices}
        </p>
      </div>
    </div>
  );
}
