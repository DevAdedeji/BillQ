import Stripe from "stripe"
import { NextResponse } from "next/server"

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
