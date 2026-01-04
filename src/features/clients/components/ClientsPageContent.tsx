"use client";

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
import { Skeleton } from "@/components/ui/skeleton";
import NewClient from "@/features/clients/components/NewClient";
import { EllipsisVertical, Search, Plus } from "lucide-react";
import { useClients } from "../hooks/useClients";
import { Client } from "../types";
import { useState } from "react";
import { useDeleteClient } from "../hooks/useDeleteClient";
import { getErrorMessage } from "@/utils";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import EditClient from "./EditClient";
import EmptyTableState from "@/components/shared/EmptyTableState";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:w-[300px]" />
        <Skeleton className="h-10 w-full sm:w-32" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function ClientsPageContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const {
    data: clients,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useClients();

  const router = useRouter();

  const isDataLoading = isLoading || (!!clients && isFetching);

  const refreshDetails = () => {
    setIsDialogOpen(false);
    refetch();
  };

  const { mutate, isPending } = useDeleteClient({
    onSuccess: () => {
      toast.success("Client deleted successfully");
      refreshDetails();
      setOpenDropdownId(null);
    },
    onError: (err: unknown) => {
      const message = getErrorMessage(err);
      toast.error(message || "Something went wrong");
      setOpenDropdownId(null);
    },
  });

  const goToClientPage = (id: string) => {
    router.push(`/dashboard/clients/${id}`);
  };

  const filteredClients = clients?.filter(
    (client: Client) =>
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  ) ?? [];

  if (isDataLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Failed to load clients
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              <span>New Client</span>
            </Button>
          </DialogTrigger>
          <NewClient closeDialog={refreshDetails} />
        </Dialog>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Address</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            {clients && clients.length === 0 ? (
              <EmptyTableState
                colSpan={4}
                title="No Clients Found"
                description="Get started by adding your first client."
              />
            ) : clients && clients.length > 0 && filteredClients.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        No clients match your search
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
                {filteredClients.map((client) => (
                  <TableRow
                    key={client.id}
                    className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    onClick={() => goToClientPage(client.id)}
                  >
                    <TableCell className="font-medium">
                      {client.name}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {client.email}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {client.address || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu
                        open={openDropdownId === client.id}
                        onOpenChange={(isOpen) => {
                          if (!isPending)
                            setOpenDropdownId(isOpen ? client.id : null);
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
                                setSelectedClient(client);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                mutate(client.id);
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
      </div>

      <Dialog
        open={!!selectedClient}
        onOpenChange={() => setSelectedClient(null)}
      >
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <EditClient
          closeDialog={() => {
            refreshDetails();
            setSelectedClient(null);
          }}
          client={selectedClient}
        />
      </Dialog>
    </div>
  );
}