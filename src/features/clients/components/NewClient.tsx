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
import { useNewCLient } from "../hooks/useNewClient"
import { getErrorMessage } from "@/utils"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

interface NewClientProps {
    closeDialog: () => void
}

export default function NewClient({ closeDialog }: NewClientProps) {
    const { handleSubmit, reset, register, formState: { errors } } = useForm<ClientSchemaInputs>({
        resolver: zodResolver(clientSchema)
    })

    const { mutate, isPending } = useNewCLient({
        onSuccess: () => {
            toast.success("Client created successfully")
            reset()
            closeDialog()
        },
        onError: (e: unknown) => {
            const message = getErrorMessage(e)
            toast.error(message || "Something went wrong")
        }
    })

    const onSubmit = (data: ClientSchemaInputs) => {
        mutate({ email: data.email, name: data.name, address: data.address })
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create Client</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Company?Brand Name</FieldLabel>
                            <Input id="name" type="text" placeholder="John Doe" {...register("name")} />
                            {errors.name && <p className="text-error text-xs">{errors.name.message}</p>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email">Personal/Brand Email Address</FieldLabel>
                            <Input id="email" type="email" placeholder="example@gmail.com" {...register("email")} />
                            {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="address">Company/Brand Address</FieldLabel>
                            <Input id="address" type="text" placeholder="Enter Address" {...register("address")} />
                            {errors.address && <p className="text-error text-xs">{errors.address.message}</p>}
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
                            Save
                        </span>
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}