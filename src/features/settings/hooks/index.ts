"use client";

import { useMutation } from "@tanstack/react-query";
import { useUser } from "../services";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils";

export function useUpdateUserProfile() {
  const { useUpdateProfile } = useUser();
  return useMutation({
    mutationFn: useUpdateProfile,
    onSuccess: () => toast.success("Profile updated successfully"),
    onError: (error: unknown) => {
      const msg = getErrorMessage(error);
      toast.error(msg || "Something went wrong");
    },
  });
}

export function useUpdateUserPassword() {
  const { useUpdatePassword } = useUser();
  return useMutation({
    mutationFn: useUpdatePassword,
    onSuccess: () => toast.success("Password updated successfully"),
    onError: (error: unknown) => {
      const msg = getErrorMessage(error);
      toast.error(msg || "Something went wrong");
    },
  });
}
