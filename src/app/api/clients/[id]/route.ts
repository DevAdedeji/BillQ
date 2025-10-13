import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getErrorMessage } from "@/utils";
import { clientSchema } from "@/features/clients/schemas";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        const data = clientSchema.partial().parse(body);

        const client = await prisma.client.findUnique({ where: { id } });
        if (!client || client.userId !== user.id) {
            return NextResponse.json({ error: "Client not found or unauthorized" }, { status: 404 });
        }

        const updatedClient = await prisma.client.update({
            where: { id },
            data,
        });

        return NextResponse.json(updatedClient);
    } catch (err: unknown) {
        const message = getErrorMessage(err);
        return NextResponse.json({ error: message || "Failed to update client" }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const client = await prisma.client.findUnique({
            where: { id },
        });

        if (!client || client.userId !== user.id) {
            return NextResponse.json({ error: "Client not found or unauthorized" }, { status: 404 });
        }

        await prisma.client.delete({ where: { id } });

        return NextResponse.json({ message: "Client deleted successfully" });
    } catch (err: unknown) {
        const message = getErrorMessage(err);
        return NextResponse.json({ error: message || "Failed to delete client" }, { status: 400 });
    }
}
