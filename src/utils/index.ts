export const getErrorMessage = (e: unknown) => {
    const message = e instanceof Error ? e.message : typeof e === "object" && e !== null && "message" in e && typeof (e as { message?: unknown }).message === "string" ? (e as { message: string }).message : String(e)
    return message
}

export const formatDate = (date: string | Date) => {
    const d = new Date(date)
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

export const formatCurrency = (amount?: number, currency: string = "USD") => {
    const validAmount = typeof amount === "number" ? amount : 0;

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(validAmount);
};
