import { create } from "zustand";
import type { User } from "next-auth";

interface DashboardState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
