import InvoiceDetails from "@/features/invoice/components/InvoiceDetails";

export const metadata = {
  title: "Invoice Details | BillQ Dashboard",
  description: "Manage and send invoices easily with BillQ.",
};

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main>
      <InvoiceDetails id={id} />
    </main>
  );
}
