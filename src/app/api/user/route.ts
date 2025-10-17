import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { name, email, brandName, brandEmail, brandAddress, note, terms } = await req.json()

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
                email,
                brandName,
                brandEmail,
                brandAddress,
                note,
                terms
            },
        })

        return NextResponse.json({ message: "Profile updated", user: updatedUser })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
