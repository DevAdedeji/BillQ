// TODO: Enable this once a custom domain is verified in Resend.
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
    const today = new Date()

    const sevenDaysFromNow = new Date(today)
    sevenDaysFromNow.setDate(today.getDate() + 7)

    const threeDaysFromNow = new Date(today)
    threeDaysFromNow.setDate(today.getDate() + 3)

    // Fetch invoices due in 3 or 7 days
    const invoices = await prisma.invoice.findMany({
        where: {
            status: "PENDING",
            dueDate: {
                in: [sevenDaysFromNow, threeDaysFromNow],
            },
        },
        include: {
            client: true,
            user: true,
        },
    })

    for (const invoice of invoices) {
        const daysUntilDue =
            Math.floor(
                (new Date(invoice.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            )

        const reminderType =
            daysUntilDue === 7 ? "SEVEN_DAYS_BEFORE" : "THREE_DAYS_BEFORE"

        const existingReminder = await prisma.invoiceReminder.findFirst({
            where: {
                invoiceId: invoice.id,
                type: reminderType,
                sent: true,
            },
        })

        if (existingReminder) continue

        // Send email
        await resend.emails.send({
            from: invoice.user.brandEmail || "noreply@yourapp.com",
            to: invoice.client.email,
            subject:
                daysUntilDue === 7
                    ? `Reminder: Invoice #${invoice.invoiceNumber} due in 7 days`
                    : `Reminder: Invoice #${invoice.invoiceNumber} due in 3 days`,
            html: `
        <p>Hi ${invoice.client.name},</p>
        <p>This is a friendly reminder that your invoice <strong>#${invoice.invoiceNumber}</strong> is due on <strong>${invoice.dueDate.toDateString()}</strong>.</p>
        <p>Total Amount: $${invoice.totalAmount}</p>
        <p>Please ensure payment is made on time to avoid penalties.</p>
        <p>Thank you,</p>
        <p>${invoice.user.brandName || "The ${invoice.user.name}'s Team"}</p>
      `,
        })

        await prisma.invoiceReminder.create({
            data: {
                invoiceId: invoice.id,
                type: reminderType,
                sent: true,
                sentAt: new Date(),
            },
        })
    }

    return NextResponse.json({ success: true })
}
