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
import Image from "next/image"
import { Spinner } from "@/components/ui/spinner"
import { useSignIn } from "@/features/auth/hooks"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { getErrorMessage } from "@/utils"

export default function LoginPage() {

    const { handleSubmit, register, formState: { errors } } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema)
    })

    const router = useRouter()

    const { mutate, isPending } = useSignIn(
        {
            onSuccess: () => {
                router.push("/dashboard/invoices")
            },
            onError: (e: unknown) => {
                const message = getErrorMessage(e)
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
                <div className="flex flex-col gap-2">
                    <Button type="submit" disabled={isPending} className="w-full">
                        {
                            isPending &&
                            <Spinner />
                        }
                        <span>Login</span>
                    </Button>
                    <p className="text-center text-sm capitalize">or</p>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => signIn("google", { callbackUrl: "/dashboard/invoices" })}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <Image src="/google.svg" height={20} width={20} alt="Google logo" /> Continue with Google
                    </Button>
                </div>
            </form>
            <p className="text-center text-sm mt-6">
                Don&apos;t have an account?
                <Link href="/auth/signup" className="font-medium text-primary ml-1">Sign up</Link>
            </p>
        </div>
    )
}