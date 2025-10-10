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

export default function LoginPage() {
    const { handleSubmit, register, formState: { errors } } = useForm<SignUpFormInputs>({
        resolver: zodResolver(signUpSchema)
    })

    const onSubmit = async (data: SignUpFormInputs) => {
        console.log(data)
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
                            <Input id="email" type="email" placeholder="example@gmail.com" {...register("email")} />
                            {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input id="password" type="password" placeholder="********" {...register("password")} />
                            {errors.password && <p className="text-error text-xs">{errors.password.message}</p>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                            <Input id="confirmPassword" type="password" placeholder="********" {...register("confirmPassword")} />
                            {errors.confirmPassword && <p className="text-error text-xs">{errors.confirmPassword.message}</p>}
                        </Field>
                    </FieldGroup>
                </FieldSet>
                <Button type="submit" className="w-full">Login</Button>
            </form>
            <p className="text-center text-sm mt-6">
                Already have an account?
                <Link href="/auth/login" className="font-medium text-primary ml-1">Log In</Link>
            </p>
        </div>
    )
}