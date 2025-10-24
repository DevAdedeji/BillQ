import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

vi.mock("@/features/auth/hooks", () => ({
  useSignIn: vi.fn(),
  useSignUp: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(
    () =>
      new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 100)),
  ),
  signOut: vi.fn(),
  useSession: () => ({ data: null, status: "unauthenticated" }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/features/clients/hooks/useNewClient", () => ({
  useNewCLient: (options?: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => ({
    isPending: false,
    mutate: vi.fn(() => {
      options?.onSuccess?.();
    }),
  }),
}));

global.fetch = vi.fn(
  () =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            ok: true,
            json: async () => ({ message: "success" }),
          } as Response),
        100,
      ),
    ),
) as typeof fetch;

export function renderWithProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{ui}</SessionProvider>
    </QueryClientProvider>,
  );
}
