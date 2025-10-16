import { z } from "zod"

export const userSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    brandName: z.string().optional(),
    brandEmail: z.string().email("Invalid Email").optional(),
    brandAddress: z.string().optional(),
})


export type UserSchemaInputs = z.infer<typeof userSchema>


export const passwordSchema = z.object({
    password: z.string().min(6),
    oldPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password newation is required"),
}).refine((data) => data.password === data.newPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})


export type PasswordSchemaInputs = z.infer<typeof passwordSchema>