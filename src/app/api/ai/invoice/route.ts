import { NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getErrorMessage } from "@/utils";
import { z } from "zod";

const invoiceSchema = z.object({
  clientName: z.string(),
  clientEmail: z.string().nullable(),
  items: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      quantity: z.number(),
      price: z.number(),
    }),
  ),
  tax: z.number(),
  discount: z.number(),
  issueDate: z.string(),
  dueDate: z.string(),
  dueAmount: z.number(),
  paidAmount: z.number(),
  totalAmount: z.number(),
  status: z.enum(["PENDING", "PAID", "OVERDUE"]),
});

type invoiceJSONSchema = z.infer<typeof invoiceSchema>;

function parseJsonResponse(text: string) {
  text = text
    .replace(/```(json)?\s*/g, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse JSON:", err);
  }
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentDate = new Date().toISOString().split("T")[0];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
                You are an AI invoice assistant. Today’s date is ${currentDate}. Generate a structured JSON for an invoice based on the following description:
                "${prompt}"

                The JSON must include:
                - clientName
                - clientEmail (if mentioned)
                - items: [{ name, description, quantity, price }]
                - tax (if mentioned, otherwise 0)
                - discount (if mentioned, otherwise 0)
                - dueDate (ISO format if possible)
                - issueDate (if mentioned, else current data)
                - dueAmount (calculated)
                - paidAmount (calculated)
                - totalAmount (calculated)
                - status (if mentioned else PENDING)

                The JSON must strictly follow this schema:
                {
                    "clientName": "string",
                    "clientEmail": "string or null",
                    "items": [{ "name": "string", "description": "string", "quantity": "number", "price": "number" }],
                    "tax": "number",
                    "discount": "number",
                    "issueDate": "string (YYYY-MM-DD)",
                    "dueDate": "string (YYYY-MM-DD)",
                    "dueAmount": "number",
                    "paidAmount": "number",
                    "totalAmount": "number",
                    "status": "PENDING | PAID | OVERDUE"
                }
                Return only valid JSON.
            `,
    });

    const invoiceJSON = parseJsonResponse(response.text || "");

    const parsedInvoice = invoiceSchema.parse(invoiceJSON) as invoiceJSONSchema;

    const safeEmail =
      parsedInvoice.clientEmail ??
      `${parsedInvoice.clientName.toLowerCase().replace(/\s+/g, "_")}@unknown.com`;

    let client = null;

    if (parsedInvoice.clientEmail) {
      client = await prisma.client.findFirst({
        where: {
          userId: user.id,
          email: parsedInvoice.clientEmail,
        },
      });
    } else {
      client = await prisma.client.findFirst({
        where: {
          userId: user.id,
          name: {
            equals: parsedInvoice.clientName,
            mode: "insensitive",
          },
        },
      });
    }

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: parsedInvoice.clientName,
          email: parsedInvoice.clientEmail ?? safeEmail,
          userId: user.id,
        },
      });
    }

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        clientId: client.id,
        userId: user.id,
        issueDate: new Date(parsedInvoice.issueDate),
        dueDate: new Date(parsedInvoice.dueDate),
        tax: parsedInvoice.tax,
        discount: parsedInvoice.discount,
        dueAmount: parsedInvoice.dueAmount,
        paidAmount: parsedInvoice.paidAmount,
        totalAmount: parsedInvoice.totalAmount,
        status: parsedInvoice.status,
        items: {
          create: parsedInvoice.items.map((item) => ({
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.quantity * item.price,
          })),
        },
        notes: "AI-generated invoice",
      },
      include: {
        client: true,
        items: true,
      },
    });
    return NextResponse.json({ message: "Invoice created", invoice });
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    return NextResponse.json(
      { error: message || "Failed to create invoice" },
      { status: 400 },
    );
  }
}
