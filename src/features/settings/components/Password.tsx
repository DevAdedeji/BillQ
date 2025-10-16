"use client"
import { useCurrentUser } from "@/lib/session"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PasswordSchemaInputs, passwordSchema } from "../schemas"
import { useUpdateUserPassword } from "../hooks"

export default function Password() {
    const { user, isLoading } = useCurrentUser()
    const { mutate, isPending } = useUpdateUserPassword()
    const { register, handleSubmit } = useForm<PasswordSchemaInputs>({
        resolver: zodResolver(passwordSchema)
    })
    if (isLoading) {
        return <div className="w-full grid grid-cols-2 gap-4">
            <Skeleton className="bg-slate-200 w-full h-20" />
            <Skeleton className="bg-slate-200 w-full h-20" />
            <Skeleton className="bg-slate-200 w-full h-20" />
            <Skeleton className="bg-slate-200 w-full h-20" />
        </div>
    }
    if (user) {
        const onSubmit = (data: PasswordSchemaInputs) => {
            mutate(data)
        }
        return (
            <div>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-2/3">
                    <FieldSet>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Current Password</FieldLabel>
                                <PasswordInput {...register("oldPassword")} />
                            </Field>
                            <Field>
                                <FieldLabel>New Password</FieldLabel>
                                <PasswordInput {...register("newPassword")} />
                            </Field>
                            <Field>
                                <FieldLabel>Confirm Password</FieldLabel>
                                <PasswordInput {...register("password")} />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <Button type="submit" className="mt-4" disabled={isPending}>
                        {isPending && <Spinner />}
                        <span>Save Changes</span>
                    </Button>
                </form>
            </div>
        )
    }
}