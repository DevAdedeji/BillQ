import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { invoiceFormSchema } from "@/features/invoice/schemas"
import { getCurrentUser } from "@/lib/session"
import { getErrorMessage } from "@/utils"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const parsed = invoiceFormSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { error: true, message: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const data = parsed.data

        const {
            clientId,
            dueDate,
            status,
            tax,
            discount,
            paidAmount,
            totalAmount,
            dueAmount,
            items,
            invoiceNumber,
            issueDate,
        } = data

        const invoice = await prisma.invoice.create({
            data: {
                userId: user.id,
                clientId,
                dueDate,
                status,
                tax,
                discount,
                paidAmount,
                totalAmount,
                dueAmount,
                invoiceNumber,
                issueDate,
                items: {
                    create: items.map((item) => ({
                        name: item.name,
                        description: item.description,
                        quantity: item.quantity,
                        price: item.price,
                        totalPrice: item.totalPrice,
                    })),
                },
            },
            include: { items: true, client: true },
        })

        return NextResponse.json({ message: "Invoice created successfully", invoice }, { status: 201 })
    } catch (error) {
        console.error("Error creating invoice:", error)
        return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
    }
}


export async function GET() {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userClients = await prisma.invoice.findMany({
            where: { userId: user.id },
            include: { client: true, items: true },
        })

        return NextResponse.json({ data: userClients }, { status: 200 })
    } catch (err: unknown) {
        const message = getErrorMessage(err)
        return NextResponse.json({ error: message || "Failed to fetch invoices" }, { status: 400 })
    }
}