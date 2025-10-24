import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invoiceFormSchema } from "@/features/invoice/schemas";
import { getCurrentUser } from "@/lib/session";
import { getErrorMessage } from "@/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const parsed = invoiceFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: true, message: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

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
    } = data;

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
    });

    return NextResponse.json(
      { message: "Invoice created successfully", invoice },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 15;

    const where: Record<string, unknown> = { userId: user.id };

    if (
      status &&
      ["PENDING", "PAID", "OVERDUE", "PARTIALLY_PAID"].includes(
        status.toUpperCase(),
      )
    ) {
      where.status = status.toUpperCase();
    }

    // Total count for pagination
    const totalInvoices = await prisma.invoice.count({ where });

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { client: true, items: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    const [pendingInvoices, overdueInvoices, paidInvoices] = await Promise.all([
      prisma.invoice.count({
        where: { userId: user.id, status: "PENDING" },
      }),
      prisma.invoice.count({
        where: { userId: user.id, status: "OVERDUE" },
      }),
      prisma.invoice.count({
        where: { userId: user.id, status: "PAID" },
      }),
    ]);

    const totalPages = Math.ceil(totalInvoices / limit);

    return NextResponse.json(
      {
        data: {
          invoices,
          pagination: {
            page,
            limit,
            totalPages,
            totalInvoices,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
          stats: {
            totalInvoices,
            pendingInvoices,
            paidInvoices,
            overdueInvoices,
          },
        },
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    return NextResponse.json(
      { error: message || "Failed to fetch invoices" },
      { status: 400 },
    );
  }
}
