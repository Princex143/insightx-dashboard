import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login } from "../api/mockApi";
import type { Role, User } from "../types";

type Theme = "light" | "dark";

type AuthState = {
  token: string | null;
  user: User | null;
  theme: Theme;
  isAuthenticating: boolean;
  error: string | null;
  authenticate: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setTheme: (theme: Theme) => void;
  setRole: (role: Role) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      theme: "light",
      isAuthenticating: false,
      error: null,
      authenticate: async (email, password) => {
        set({ isAuthenticating: true, error: null });
        try {
          const result = await login(email, password);
          set({ token: result.token, user: result.user, isAuthenticating: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Authentication failed",
            isAuthenticating: false,
          });
        }
      },
      logout: () => set({ token: null, user: null, error: null }),
      setTheme: (theme) => set({ theme }),
      setRole: (role) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, role } });
      },
    }),
    {
      name: "insightx-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        theme: state.theme,
      }),
    },
  ),
);
