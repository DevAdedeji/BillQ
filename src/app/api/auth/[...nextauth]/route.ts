import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Missing credentials")
                }
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })
                if (!user || !user.password) {
                    throw new Error("User not found")
                }

                const isValid = await bcrypt.compare(credentials.password, user.password)
                if (!isValid) throw new Error("Invalid password")
                return { ...user }
            }
        })
    ],
    pages: {
        signIn: "/auth/login"
    },
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }