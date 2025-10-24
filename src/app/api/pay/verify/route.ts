import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json(
      { success: false, message: "Missing session ID" },
      { status: 400 },
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const invoiceId = session.metadata?.invoiceId;
    const amountPaid = (session.amount_total ?? 0) / 100;

    if (session.payment_status === "paid" && invoiceId) {
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
      });
      if (!invoice) throw new Error("Invoice not found");

      const newPaid = (invoice.paidAmount ?? 0) + amountPaid;
      const due = Math.max(invoice.totalAmount - newPaid, 0);
      const status = due === 0 ? "PAID" : "PARTIALLY_PAID";

      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          paidAmount: newPaid,
          dueAmount: due,
          status,
        },
      });

      const payment = await prisma.payment.findUnique({
        where: { invoiceId },
      });

      if (payment) {
        await prisma.payment.update({
          where: { invoiceId },
          data: {
            amount: payment.amount + amountPaid,
            stripeSessionId: session.id,
            status: session.payment_status,
            createdAt: new Date(),
          },
        });
      } else {
        await prisma.payment.create({
          data: {
            invoiceId,
            amount: amountPaid,
            stripeSessionId: session.id,
            status: session.payment_status,
            userId: invoice.userId,
          },
        });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 500 },
    );
  }
}
