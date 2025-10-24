/* eslint-disable @typescript-eslint/no-explicit-any */
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../../../tests/setupTests";
import LoginPage from "./page";
import { useSignIn } from "@/features/auth/hooks";
import { useRouter } from "next/navigation";

const mockMutate = vi.fn();
const mockPush = vi.fn();
const mockedSignIn = vi.mocked(useSignIn);
const mockedRouter = vi.mocked(useRouter);

describe("login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedRouter.mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      prefetch: vi.fn(),
    } as any);
  });

  it("throws an error when user click on submit without inserting password", async () => {
    mockedSignIn.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);

    renderWithProviders(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("example@gmail.com");
    fireEvent.change(emailInput, { target: { value: "example@gmail.com" } });
    fireEvent.submit(screen.getByRole("button", { name: "Login" }));
    expect(
      await screen.findByText("Password must be at least 6 characters"),
    ).toBeInTheDocument();
  });

  it("throws an error when password length is not up to 6 char", async () => {
    mockedSignIn.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);

    renderWithProviders(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("example@gmail.com");
    const passwordInput = screen.getByPlaceholderText("********");
    fireEvent.change(emailInput, { target: { value: "example@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "may" } });
    fireEvent.submit(screen.getByRole("button", { name: "Login" }));
    expect(
      await screen.findByText("Password must be at least 6 characters"),
    ).toBeInTheDocument();
  });

  it("shows spinner when submitting valid form", async () => {
    mockedSignIn.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);

    const { container } = renderWithProviders(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("example@gmail.com");
    const passwordInput = screen.getByPlaceholderText("********");
    const submitButton = container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    fireEvent.change(emailInput, { target: { value: "example@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "1234567" } });

    expect(submitButton).toBeDisabled();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("calls mutate on successful form submission", async () => {
    mockedSignIn.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);

    const { container } = renderWithProviders(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("example@gmail.com");
    const passwordInput = screen.getByPlaceholderText("********");
    const submitButton = container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    fireEvent.change(emailInput, { target: { value: "example@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "1234567" } });
    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
      expect(mockMutate).toHaveBeenCalledWith({
        email: "example@gmail.com",
        password: "1234567",
      });
    });
  });

  it("successfully redirects on successful login", async () => {
    mockedSignIn.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);
    const { container } = renderWithProviders(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("example@gmail.com");
    const passwordInput = screen.getByPlaceholderText("********");
    const submitButton = container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    fireEvent.change(emailInput, { target: { value: "example@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "1234567" } });
    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
      expect(mockMutate).toHaveBeenCalledWith({
        email: "example@gmail.com",
        password: "1234567",
      });
    });
    const { onSuccess } = (mockedSignIn as any).mock.calls[0][0];
    onSuccess();
    expect(mockPush).toHaveBeenCalledWith("/dashboard/overview");
  });
});
