import { useState } from "react";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import NewInvoiceWithAI from "./NewInvoiceWithAI";

export default function InvoiceHeader() {
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
      <h2 className="text-2xl font-semibold hidden lg:block">
        Manage Invoices
      </h2>
      <div className="self-end flex items-center gap-2">
        <Link
          href="/dashboard/invoices/create"
          className="text-sm flex items-center gap-2 bg-primary text-white h-9 px-4 py-2 rounded-md"
        >
          <Plus size={14} />
          <span>New Invoice</span>
        </Link>
        <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Sparkles />
            </Button>
          </DialogTrigger>
          <NewInvoiceWithAI />
        </Dialog>
      </div>
    </div>
  );
}
