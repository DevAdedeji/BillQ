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
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                token.name = user.name
                token.email = user.email
                token.brandName = user.brandName
                token.brandEmail = user.brandEmail
                token.brandAddress = user.brandAddress
                token.note = user.note
                token.terms = user.terms
                token.selectedTemplateId = user.selectedTemplateId
            }
            if (trigger === "update" && session?.user) {
                token.brandName = session.user.brandName
                token.brandEmail = session.user.brandEmail
                token.brandAddress = session.user.brandAddress
                token.note = session.user.note
                token.terms = session.user.terms
                token.selectedTemplateId = session.user.selectedTemplateId
            }
            const dbUser = await prisma.user.findUnique({
                where: { id: token.id as string },
            })

            if (dbUser) {
                token.brandName = dbUser.brandName
                token.brandEmail = dbUser.brandEmail
                token.brandAddress = dbUser.brandAddress
                token.note = dbUser.note
                token.terms = dbUser.terms
                token.selectedTemplateId = dbUser.selectedTemplateId
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.name = token.name
                session.user.email = token.email
                session.user.brandName = (token.brandName ?? null) as string | null
                session.user.brandEmail = (token.brandEmail ?? null) as string | null
                session.user.brandAddress = (token.brandAddress ?? null) as string | null
                session.user.terms = (token.terms ?? null) as string | null
                session.user.note = (token.note ?? null) as string | null
                session.user.selectedTemplateId = (token.selectedTemplateId ?? null) as string | null
            }
            return session
        }
    }
}