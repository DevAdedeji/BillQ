import ClientDetails from "@/features/clients/components/ClientDetails";

export const metadata = {
    title: "Client Details | BillQ Dashboard",
    description: "Manage and send invoices easily with BillQ.",
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <main>
            <ClientDetails id={id} />
        </main>
    )
}