import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { clientSchema } from "@/features/clients/schemas";
import { getErrorMessage } from "@/utils";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const body = await req.json()
        const data = clientSchema.parse(body)

        const existingClient = await prisma.client.findUnique({
            where: {
                userId_email: {
                    userId: user.id,
                    email: data.email
                }
            }
        });
        if (existingClient) {
            console.log(existingClient);
            return NextResponse.json({ error: "Client already exists" }, { status: 400 })
        }

        const client = await prisma.client.create({
            data: {
                ...data,
                userId: user.id
            }
        })
        return NextResponse.json({ data: client }, { status: 201 })
    } catch (err: unknown) {
        const message = getErrorMessage(err)
        return NextResponse.json({ error: message || "Failed to create client" }, { status: 400 })
    }
}

export async function GET() {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userClients = await prisma.client.findMany({
            where: { userId: user.id }
        })

        return NextResponse.json({ data: userClients }, { status: 200 })
    } catch (err: unknown) {
        const message = getErrorMessage(err)
        return NextResponse.json({ error: message || "Failed to create client" }, { status: 400 })
    }
}