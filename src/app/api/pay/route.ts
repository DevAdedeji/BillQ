import Stripe from "stripe"
import { NextResponse } from "next/server"
import { getErrorMessage } from "@/utils"
import { getCurrentUser } from "@/lib/session"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
    try {
        const { invoiceId, amount, currency = "usd" } = await req.json()

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: { name: `Invoice #${invoiceId}` },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoiceId}?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoiceId}?canceled=true`,
            metadata: { invoiceId, amount },
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
    }
}


export async function GET() {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const payments = await prisma.payment.findMany({
            where: { userId: user.id },
            include: {
                invoice: {
                    include: {
                        client: true,
                    }
                },
            }
        })

        return NextResponse.json({ data: payments }, { status: 200 })

    } catch (err: unknown) {
        const message = getErrorMessage(err)
        return NextResponse.json({ error: message || "Failed to fetch payments" }, { status: 400 })
    }
}