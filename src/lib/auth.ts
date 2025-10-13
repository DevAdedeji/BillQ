import { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
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
                const { email, password } = credentials ?? {}

                if (!email || !password) throw new Error("Email and password are required")

                const user = await prisma.user.findUnique({
                    where: { email }
                })
                if (!user || !user.password) {
                    throw new Error("Invalid email or password")
                }

                const isValid = await bcrypt.compare(password, user.password)
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
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.id = user.id
            return token
        },
        async session({ session, token }) {
            if (token) session.user.id = token.id as string
            return session
        }
    }
}