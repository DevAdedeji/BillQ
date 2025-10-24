"use client";

import { useMutation } from "@tanstack/react-query";

export const useSignUp = (options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (data: unknown) => void;
}) => {
  return useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Signup Failed");
      }
      return res.json();
    },
    ...options,
  });
};
