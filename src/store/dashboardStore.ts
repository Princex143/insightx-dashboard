import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EventFilters, SavedView, Widget } from "../types";

const defaultWidgets: Widget[] = [
  { id: "w-kpi", title: "KPI Overview", type: "kpi" },
  { id: "w-chart", title: "Traffic Trend", type: "chart" },
  { id: "w-feed", title: "Incident Feed", type: "feed" },
  { id: "w-table", title: "Hot Services", type: "table" },
];

type DashboardState = {
  widgets: Widget[];
  eventFilters: EventFilters;
  savedViews: SavedView[];
  reorderWidgets: (fromId: string, toId: string) => void;
  updateEventFilters: (next: Partial<EventFilters>) => void;
  saveCurrentView: (name: string) => void;
  applySavedView: (id: string) => void;
  deleteSavedView: (id: string) => void;
  resetLayout: () => void;
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      widgets: defaultWidgets,
      eventFilters: {
        q: "",
        severity: "all",
        service: "all",
      },
      savedViews: [],
      reorderWidgets: (fromId, toId) => {
        if (fromId === toId) return;
        const current = get().widgets;
        const fromIndex = current.findIndex((w) => w.id === fromId);
        const toIndex = current.findIndex((w) => w.id === toId);
        if (fromIndex < 0 || toIndex < 0) return;
        const clone = [...current];
        const [moved] = clone.splice(fromIndex, 1);
        clone.splice(toIndex, 0, moved);
        set({ widgets: clone });
      },
      updateEventFilters: (next) =>
        set((state) => ({
          eventFilters: {
            ...state.eventFilters,
            ...next,
          },
        })),
      saveCurrentView: (name) =>
        set((state) => ({
          savedViews: [
            ...state.savedViews,
            {
              id: `view_${Date.now()}`,
              name,
              filters: state.eventFilters,
            },
          ],
        })),
      applySavedView: (id) =>
        set((state) => {
          const view = state.savedViews.find((item) => item.id === id);
          if (!view) {
            return state;
          }
          return { ...state, eventFilters: view.filters };
        }),
      deleteSavedView: (id) =>
        set((state) => ({
          savedViews: state.savedViews.filter((item) => item.id !== id),
        })),
      resetLayout: () => set({ widgets: defaultWidgets }),
    }),
    { name: "insightx-dashboard" },
  ),
);
