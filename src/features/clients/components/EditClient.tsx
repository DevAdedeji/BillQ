"use client"

import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { clientSchema, ClientSchemaInputs } from "../schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEditClient } from "../hooks/useEditClient"
import { getErrorMessage } from "@/utils"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { Client } from "../hooks/useClients"
import { useEffect } from "react"

interface EditClientProps {
    closeDialog: () => void,
    client: Client | null
}

export default function EditClient({ closeDialog, client }: EditClientProps) {
    const { handleSubmit, reset, register, formState: { errors } } = useForm<ClientSchemaInputs>({
        resolver: zodResolver(clientSchema),
    })

    useEffect(() => {
        reset({
            name: client?.name,
            companyName: client?.companyName ?? undefined,
            email: client?.email,
        })
    }, [reset, client])


    const { mutate, isPending } = useEditClient({
        onSuccess: () => {
            toast.success("Client updates successfully")
            reset()
            closeDialog()
        },
        onError: (e: unknown) => {
            const message = getErrorMessage(e)
            toast.error(message || "Something went wrong")
        }
    })

    const onSubmit = (data: ClientSchemaInputs) => {
        const { email, name, companyName } = data
        if (client?.id) mutate({ id: client.id, data: { email, name, companyName } })
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit Client</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input id="name" type="text" placeholder="John Doe" {...register("name")} />
                            {errors.name && <p className="text-error text-xs">{errors.name.message}</p>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email">Personal/Brand Email Address</FieldLabel>
                            <Input id="email" type="email" placeholder="example@gmail.com" {...register("email")} />
                            {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="companyName">Company/Brand Name</FieldLabel>
                            <Input id="companyName" type="text" placeholder="Brand name" {...register("companyName")} />
                            {errors.companyName && <p className="text-error text-xs">{errors.companyName.message}</p>}
                        </Field>
                    </FieldGroup>
                </FieldSet>
                <div className="grid grid-cols-2 gap-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                        {
                            isPending &&
                            <Spinner />
                        }
                        <span>
                            Save changes
                        </span>
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}