import { z } from "zod"

export const clientSchema = z.object({
    name: z.string().min(2, "Client name is required"),
    email: z.string().email("Invalid email"),
    companyName: z.string().optional(),
})


export type ClientSchemaInputs = z.infer<typeof clientSchema>