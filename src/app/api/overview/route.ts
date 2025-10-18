import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getErrorMessage } from "@/utils"
import { getCurrentUser } from "@/lib/session"

export async function GET() {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const [invoices, totalInvoices, payments, totalClients, totalEarned, totalDue] = await Promise.all([
            prisma.invoice.findMany({
                where: { userId: user.id },
                take: 5,
                orderBy: { createdAt: "desc" },
                include: { client: true }
            }),
            prisma.invoice.count({
                where: { userId: user.id },
            }),
            prisma.payment.findMany({
                where: { userId: user.id },
                take: 5,
                include: { invoice: { include: { client: true } } }
            }),
            prisma.client.count({
                where: { userId: user.id },
            }),
            prisma.invoice.aggregate({
                where: { userId: user.id },
                _sum: { paidAmount: true },
            }),
            prisma.invoice.aggregate({
                where: { userId: user.id },
                _sum: { dueAmount: true },
            })
        ])
        return NextResponse.json({ invoices, totalInvoices, payments, totalClients, totalEarned: totalEarned._sum.paidAmount, totalDue: totalDue._sum.dueAmount }, { status: 200 })
    } catch (err: unknown) {
        const message = getErrorMessage(err)
        return NextResponse.json({ error: message || "Failed to fetch invoices" }, { status: 400 })
    }
}