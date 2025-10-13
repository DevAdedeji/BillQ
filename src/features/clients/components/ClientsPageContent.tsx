"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NewClient from "@/features/clients/components/NewClient"
import { Skeleton } from "@/components/ui/skeleton"
import { EllipsisVertical } from "lucide-react"
import { Client, useClients } from "../hooks/useClients"
import { useState } from "react"
import { useDeleteClient } from "../hooks/useDeleteClient"
import { getErrorMessage } from "@/utils"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import EditClient from "./EditClient"

export default function ClientsPageContent() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)


    const { data: clients, isLoading, isError, refetch } = useClients()

    const refreshDetails = () => {
        setIsDialogOpen(false)
        refetch()
    }

    const { mutate, isPending } = useDeleteClient({
        onSuccess: () => {
            toast.success("Client deleted successfully")
            refreshDetails()
            setOpenDropdownId(null)
        },
        onError: (err: unknown) => {
            const message = getErrorMessage(err)
            toast.error(message || "Something went wrong")
            setOpenDropdownId(null)
        }
    })

    const filteredClients = clients?.filter((client: Client) => client.name.toLowerCase().includes(searchQuery.toLowerCase()) || client.email.toLowerCase().includes(searchQuery.toLowerCase()))

    const hasClients = clients && clients.length > 0;

    if (isLoading) return <div className="flex flex-col gap-2">
        <Skeleton className="w-full bg-slate-300" />
        {
            [1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-3 gap-2">
                    <Skeleton className="bg-slate-300" />
                    <Skeleton className="bg-slate-300" />
                    <Skeleton className="bg-slate-300" />
                </div>
            )
            )
        }
    </div>
    if (isError) return <div></div>

    return (
        <div className="flex flex-col gap-6 px-4 py-8 lg:p-8">
            {
                hasClients &&
                <div className="flex items-center justify-between gap-2">
                    <Input placeholder="Search clients" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="lg:w-[40%]" />
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>New Client</Button>
                        </DialogTrigger>
                        <NewClient closeDialog={refreshDetails} />
                    </Dialog>

                </div>
            }
            {
                clients && clients.length === 0 ?
                    <div className="p-10 bg-primary/10 rounded-lg flex flex-col items-center justify-center text-center gap-4 ">
                        <svg className="feather feather-file-text text-primary" fill="none" height="48" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <h3 className="text-xl font-bold mb-2">No Clients Found</h3>
                        <p className="text-muted-light dark:text-muted-dark max-w-xs mx-auto">Looks like you haven&apos;t created any clients yet. Get started by creating your first one.</p>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>Create New Client</Button>
                            </DialogTrigger>
                            <NewClient closeDialog={refreshDetails} />
                        </Dialog>
                    </div>
                    :
                    <div></div>
            }

            {
                filteredClients &&
                <div className="rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-100">
                                <TableHead>Name</TableHead>
                                <TableHead>Email Address</TableHead>
                                <TableHead>Company Name</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        {
                            filteredClients.length > 0 ?
                                <TableBody>
                                    {
                                        filteredClients.map((client) => (
                                            <TableRow key={client.id}>
                                                <TableCell className="font-medium">{client.name}</TableCell>
                                                <TableCell>{client.email}</TableCell>
                                                <TableCell>{client.companyName}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu open={openDropdownId === client.id}
                                                        onOpenChange={(isOpen) => {
                                                            if (!isPending) setOpenDropdownId(isOpen ? client.id : null);
                                                        }}>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline">
                                                                <EllipsisVertical />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className="w-20" align="start">
                                                            <DropdownMenuGroup>
                                                                <DropdownMenuItem onClick={() => setSelectedClient(client)}>
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => mutate(client.id)}>
                                                                    {isPending && <Spinner />}
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuGroup>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                                :
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <div className="w-full py-10 text-center font-semibold text-xl">
                                                <p>No clients match your search!</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                        }
                    </Table>
                    <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
                        <DialogTrigger asChild>
                            <div />
                        </DialogTrigger>
                        <EditClient closeDialog={() => {
                            refreshDetails()
                            setSelectedClient(null)
                        }} client={selectedClient} />
                    </Dialog>
                </div>
            }
        </div>
    )
}