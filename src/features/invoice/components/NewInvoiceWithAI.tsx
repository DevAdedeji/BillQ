"use client"

import { Textarea } from "@/components/ui/textarea"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { FormEvent, useState } from "react"
import { useNewInvoiceWithAI } from "../hooks/useNewInvoice"

export default function NewInvoiceWithAI() {
    const [prompt, setPrompt] = useState("")
    const { mutate, isPending } = useNewInvoiceWithAI()
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        mutate(prompt)
    }
    return (
        <DialogContent className="lg:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>Create Invoice with AI</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
                <Textarea
                    placeholder="Describe your invoice..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <Button disabled={isPending}>
                    {isPending && <Spinner />}
                    <p>Generate Invoice</p>
                </Button>
            </form>
        </DialogContent>
    )
}