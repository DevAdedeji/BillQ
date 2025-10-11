"use client"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { SignUpFormInputs, signUpSchema } from "@/features/auth/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"
import { PasswordInput } from "@/components/ui/password-input"
import { useSignUp } from "@/features/auth/hooks"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
    const { handleSubmit, register, formState: { errors } } = useForm<SignUpFormInputs>({
        resolver: zodResolver(signUpSchema)
    })

    const router = useRouter()

    const { mutate, isPending } = useSignUp({
        onSuccess: () => {
            toast.success("Account created successfully!")
            router.push("/auth/login")
        },
        onError: (e: unknown) => {
            const message = e instanceof Error ? e.message : typeof e === "object" && e !== null && "message" in e && typeof (e as { message?: unknown }).message === "string" ? (e as { message: string }).message : String(e)
            toast.error(message || "Something went wrong")
        },
    })

    const onSubmit = (data: SignUpFormInputs) => {
        mutate({
            name: data.fullName,
            email: data.email,
            password: data.password,
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                            <Input id="fullName" type="text" placeholder="John Doe" {...register("fullName")} />
                            {errors.fullName && <p className="text-error text-xs">{errors.fullName.message}</p>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email">Email address</FieldLabel>
                            <PasswordInput id="email" type="email" placeholder="example@gmail.com" {...register("email")} />
                            {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <PasswordInput id="password" type="password" placeholder="Enter password" {...register("password")} />
                            {errors.password && <p className="text-error text-xs">{errors.password.message}</p>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                            <Input id="confirmPassword" type="password" placeholder="Enter password again" {...register("confirmPassword")} />
                            {errors.confirmPassword && <p className="text-error text-xs">{errors.confirmPassword.message}</p>}
                        </Field>
                    </FieldGroup>
                </FieldSet>
                <Button type="submit" disabled={isPending} className="w-full">
                    {
                        isPending &&
                        <Spinner />
                    }
                    <span>Sign Up</span>
                </Button>
            </form>
            <p className="text-center text-sm mt-6">
                Already have an account?
                <Link href="/auth/login" className="font-medium text-primary ml-1">Log In</Link>
            </p>
        </div>
    )
}