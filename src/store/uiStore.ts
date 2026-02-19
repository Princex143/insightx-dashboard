import { create } from "zustand";

type Toast = {
  id: string;
  message: string;
  kind: "info" | "success" | "error";
};

type UiState = {
  isCommandPaletteOpen: boolean;
  toasts: Toast[];
  openPalette: () => void;
  closePalette: () => void;
  addToast: (message: string, kind?: Toast["kind"]) => void;
  dismissToast: (id: string) => void;
};

export const useUiStore = create<UiState>()((set) => ({
  isCommandPaletteOpen: false,
  toasts: [],
  openPalette: () => set({ isCommandPaletteOpen: true }),
  closePalette: () => set({ isCommandPaletteOpen: false }),
  addToast: (message, kind = "info") => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, kind }] }));
    window.setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
    }, 2800);
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));
