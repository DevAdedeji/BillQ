import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "../../../../tests/setupTests";
import { Dialog } from "@/components/ui/dialog"
import NewClient from "./NewClient";
import { toast } from "sonner";

describe("New client component", () => {
    it("renders all inputs and submit button", () => {
        renderWithProviders(
            <Dialog open>
                <NewClient closeDialog={vi.fn()} />
            </Dialog>
        )
        const nameInput = screen.getByPlaceholderText("John Doe")
        const emailInput = screen.getByPlaceholderText("example@gmail.com")
        const addressInput = screen.getByPlaceholderText("Enter Address")
        const submitBtn = screen.getByRole("button", { name: "Save" })
        expect(nameInput).toBeInTheDocument()
        expect(emailInput).toBeInTheDocument()
        expect(addressInput).toBeInTheDocument()
        expect(submitBtn).toBeInTheDocument()
    })
    it("shows validation errors when required fields are empty", async () => {
        renderWithProviders(
            <Dialog open>
                <NewClient closeDialog={vi.fn()} />
            </Dialog>
        )
        const submitBtn = screen.getByRole("button", { name: "Save" })
        fireEvent.submit(submitBtn)
        expect(await screen.findByText("Client name is required")).toBeInTheDocument()
        expect(await screen.findByText("Invalid email")).toBeInTheDocument()
    })

    it("shows success toast and close dialog on success", async () => {
        const closeDialog = vi.fn()
        renderWithProviders(
            <Dialog open>
                <NewClient closeDialog={closeDialog} />
            </Dialog>
        )
        const nameInput = screen.getByPlaceholderText("John Doe")
        const emailInput = screen.getByPlaceholderText("example@gmail.com")
        const submitBtn = screen.getByRole("button", { name: "Save" })
        fireEvent.change(nameInput, { target: { value: "John Doe" } })
        fireEvent.change(emailInput, { target: { value: "text@example.com" } })
        fireEvent.submit(submitBtn)
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("Client created successfully")
            expect(closeDialog).toHaveBeenCalled()
        })
    })
})