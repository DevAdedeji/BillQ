import InvoicePreview from "@/features/invoice/components/InvoicePreview";

export const metadata = {
  title: "Invoice Preview | BillQ Dashboard",
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
      <InvoicePreview id={id} />
    </main>
  );
}
