import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

export const useSignIn = (options?: {
  onSuccess: (data: unknown) => void;
  onError: (data: unknown) => void;
}) => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      signIn("credentials", { ...data, redirect: false }),
    ...options,
  });
};
