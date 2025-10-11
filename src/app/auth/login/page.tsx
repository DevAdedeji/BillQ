"use client"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { LoginFormInputs, loginSchema } from "@/features/auth/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"
import { useSignIn } from "@/features/auth/hooks"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function LoginPage() {

    const { handleSubmit, register, formState: { errors } } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema)
    })

    const router = useRouter()

    const { mutate, isPending } = useSignIn(
        {
            onSuccess: () => {
                router.push("/dashboard/overview")
            },
            onError: (e: unknown) => {
                const message = e instanceof Error ? e.message : typeof e === "object" && e !== null && "message" in e && typeof (e as { message?: unknown }).message === "string" ? (e as { message: string }).message : String(e)
                toast.error(message || "Something went wrong")
            }
        }
    )

    const onSubmit = (data: LoginFormInputs) => {
        mutate(data)
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email address</FieldLabel>
                            <Input id="email" type="email" placeholder="example@gmail.com" {...register("email")} />
                            {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <PasswordInput id="password" type="password" placeholder="********" {...register("password")} />
                            {errors.password && <p className="text-error text-xs">{errors.password.message}</p>}
                        </Field>
                    </FieldGroup>
                </FieldSet>
                <Button type="submit" disabled={isPending} className="w-full">
                    {
                        isPending &&
                        <Spinner />
                    }
                    <span>Login</span>
                </Button>
            </form>
            <p className="text-center text-sm mt-6">
                Don&apos;t have an account?
                <Link href="/auth/signup" className="font-medium text-primary ml-1">Sign up</Link>
            </p>
        </div>
    )
}