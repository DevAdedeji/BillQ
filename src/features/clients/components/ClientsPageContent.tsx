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
import { Skeleton } from "@/components/ui/skeleton"
import NewClient from "@/features/clients/components/NewClient"
import { EllipsisVertical } from "lucide-react"
import { useClients } from "../hooks/useClients"
import { Client } from "../types"
import { useState } from "react"
import { useDeleteClient } from "../hooks/useDeleteClient"
import { getErrorMessage } from "@/utils"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import EditClient from "./EditClient"
import EmptyTableState from "@/components/shared/EmptyTableState"
import { useRouter } from "next/navigation"

function LoadingSkeleton() {
    return <div className="flex flex-col gap-6 py-8 px-4 lg:px-8">
        <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-[80%] lg:w-[40%] bg-slate-200" />
            <Skeleton className="w-10 lg:w-20 h-6 bg-slate-200" />
        </div>
        <Skeleton className="w-full h-10 bg-slate-200" />
        {
            [1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-3 gap-2">
                    <Skeleton className="h-10 bg-slate-200" />
                    <Skeleton className="h-10 bg-slate-200" />
                    <Skeleton className="h-10 bg-slate-200" />
                </div>
            )
            )
        }
    </div>
}


export default function ClientsPageContent() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)


    const { data: clients, isLoading, isError, refetch, isFetching } = useClients()

    const router = useRouter()

    const isDataLoading = isLoading || (!!clients && isFetching)

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

    const goToClientPage = (id: string) => {
        router.push(`/dashboard/clients/${id}`)
    }

    const filteredClients = clients?.filter((client: Client) => client.name.toLowerCase().includes(searchQuery.toLowerCase()) || client.email.toLowerCase().includes(searchQuery.toLowerCase()))

    const hasClients = clients && clients.length > 0;

    if (isDataLoading) return <LoadingSkeleton />

    if (isError) return <div></div>

    return (
        <div className="flex flex-col gap-6 px-4 py-8 lg:p-8">
            <div className="flex items-center justify-between gap-2">
                <Input placeholder="Search clients" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="lg:w-[40%]" />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>New Client</Button>
                    </DialogTrigger>
                    <NewClient closeDialog={refreshDetails} />
                </Dialog>
            </div>
            {
                filteredClients &&
                <div className="rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-100">
                                <TableHead>Company/Brand Name</TableHead>
                                <TableHead>Company/Brand Email</TableHead>
                                <TableHead>Company/Brand Address</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        {

                            clients && clients.length === 0 ?
                                <EmptyTableState colSpan={4} title="No Clients Found" description="Looks like you haven't added any clients yet. Start by creating your first client." />
                                :
                                clients && clients.length > 0 &&
                                    filteredClients.length === 0 ?
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={4}>
                                                <div className="w-full py-10 text-center font-semibold text-xl">
                                                    <p>No clients match your search!</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                    :
                                    <TableBody>
                                        {
                                            filteredClients.map((client) => (
                                                <TableRow key={client.id} onClick={() => goToClientPage(client.id)}>
                                                    <TableCell className="font-medium">{client.name}</TableCell>
                                                    <TableCell>{client.email}</TableCell>
                                                    <TableCell>{client.address}</TableCell>
                                                    <TableCell>
                                                        <DropdownMenu open={openDropdownId === client.id}
                                                            onOpenChange={(isOpen) => {
                                                                if (!isPending) setOpenDropdownId(isOpen ? client.id : null);
                                                            }}>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="outline" onClick={(e) => e.stopPropagation()}>
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