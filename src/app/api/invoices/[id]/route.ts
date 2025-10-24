/* eslint-disable prefer-const */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invoiceFormSchema } from "@/features/invoice/schemas";
import { getCurrentUser } from "@/lib/session";
import { getErrorMessage } from "@/utils";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await req.json();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const parsed = invoiceFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { id } = await params;

    let {
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
    } = parsed.data;

    const invoiceToBeUpdated = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoiceToBeUpdated) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (user.id !== invoiceToBeUpdated?.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (status === "PAID") {
      paidAmount = totalAmount;
      dueAmount = 0;
    }

    if (status === "PARTIALLY_PAID" && paidAmount) {
      dueAmount = Math.max(totalAmount - paidAmount, 0);
    }

    if (status === "PENDING") {
      dueAmount = 0;
      paidAmount = 0;
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    totalAmount = subtotal + (tax ?? 0) - (discount ?? 0);
    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
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
          deleteMany: {},
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
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const invoiceToBeUpdated = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoiceToBeUpdated) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (user.id !== invoiceToBeUpdated?.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
    await prisma.invoice.delete({ where: { id } });

    return NextResponse.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 },
    );
  }
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id, userId: user.id },
      include: { items: true, client: true },
    });

    if (invoice) {
      return NextResponse.json({ data: invoice }, { status: 200 });
    } else {
      NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    return NextResponse.json(
      { error: message || "Failed to fetch invoice details" },
      { status: 400 },
    );
  }
}
