export const getErrorMessage = (e: unknown) => {
    const message = e instanceof Error ? e.message : typeof e === "object" && e !== null && "message" in e && typeof (e as { message?: unknown }).message === "string" ? (e as { message: string }).message : String(e)
    return message
}

export const formatDate = (date: string | Date) => {
    if (!date) return "";

    const d = new Date(date);
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(d);
};


export const formatCurrency = (amount?: number, currency: string = "USD") => {
    const validAmount = typeof amount === "number" ? amount : 0;

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(validAmount);
};


export const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log("Copied to clipboard!");
            })
            .catch(err => {
                console.error("Failed to copy: ", err);
            });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            console.log("Copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
        document.body.removeChild(textarea);
    }
}
