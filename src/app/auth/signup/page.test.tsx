/* eslint-disable @typescript-eslint/no-explicit-any */
import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../../../tests/setupTests";
import SignUpPage from "./page";
import { useSignUp } from "@/features/auth/hooks";
import { useRouter } from "next/navigation";

const mockMutate = vi.fn()
const mockPush = vi.fn()
const mockedSignUp = vi.mocked(useSignUp)
const mockedRouter = vi.mocked(useRouter)

describe("SignUp page", () => {

    beforeEach(() => {
        vi.clearAllMocks()
        mockedRouter.mockReturnValue({
            push: mockPush,
            replace: vi.fn(),
            prefetch: vi.fn(),
        } as any)
    })

    it("shows error when password do not match", async () => {
        mockedSignUp.mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        } as any)

        renderWithProviders(<SignUpPage />)
        const fullNameInput = screen.getByPlaceholderText("John Doe")
        const emailInput = screen.getByPlaceholderText("example@gmail.com")
        const passwordInput = screen.getByPlaceholderText("Enter password")
        const confirmPasswordInput = screen.getByPlaceholderText("Enter password again")
        const submitButton = screen.getByRole("button", { name: "Sign Up" })
        fireEvent.change(fullNameInput, { target: { value: "John Doe" } })
        fireEvent.change(emailInput, { target: { value: "example@gmail.com" } })
        fireEvent.change(passwordInput, { target: { value: "1234567" } })
        fireEvent.change(confirmPasswordInput, { target: { value: "1234568" } })
        fireEvent.submit(submitButton)
        expect(await screen.findByText("Passwords do not match")).toBeInTheDocument()
    })

    it("shows spinner when submitting valid form", async () => {
        mockedSignUp.mockReturnValue({
            mutate: mockMutate,
            isPending: true,
        } as any)

        const { container } = renderWithProviders(<SignUpPage />)
        const fullNameInput = screen.getByPlaceholderText("John Doe")
        const emailInput = screen.getByPlaceholderText("example@gmail.com")
        const passwordInput = screen.getByPlaceholderText("Enter password")
        const confirmPasswordInput = screen.getByPlaceholderText("Enter password again")
        const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement
        fireEvent.change(fullNameInput, { target: { value: "John Doe" } })
        fireEvent.change(emailInput, { target: { value: "example@gmail.com" } })
        fireEvent.change(passwordInput, { target: { value: "1234567" } })
        fireEvent.change(confirmPasswordInput, { target: { value: "1234567" } })
        expect(submitButton).toBeDisabled()
        expect(screen.getByRole("status")).toBeInTheDocument()
    })

    it("successfully redirects on successful signup", async () => {
        mockedSignUp.mockReturnValue({
            mutate: mockMutate,
            isPending: true,
        } as any)

        const { container } = renderWithProviders(<SignUpPage />)
        const fullNameInput = screen.getByPlaceholderText("John Doe")
        const emailInput = screen.getByPlaceholderText("example@gmail.com")
        const passwordInput = screen.getByPlaceholderText("Enter password")
        const confirmPasswordInput = screen.getByPlaceholderText("Enter password again")
        const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement
        fireEvent.change(fullNameInput, { target: { value: "John Doe" } })
        fireEvent.change(emailInput, { target: { value: "example@gmail.com" } })
        fireEvent.change(passwordInput, { target: { value: "1234567" } })
        fireEvent.change(confirmPasswordInput, { target: { value: "1234567" } })
        fireEvent.submit(submitButton)

        const { onSuccess } = (mockedSignUp as any).mock.calls[0][0]
        onSuccess()
        expect(mockPush).toHaveBeenCalledWith("/auth/login")
    })
})