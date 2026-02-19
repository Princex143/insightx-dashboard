import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useDashboardStore } from "../store/dashboardStore";
import { useUiStore } from "../store/uiStore";

type Action = {
  id: string;
  label: string;
  run: () => void;
};

export function CommandPalette() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isOpen = useUiStore((s) => s.isCommandPaletteOpen);
  const openPalette = useUiStore((s) => s.openPalette);
  const closePalette = useUiStore((s) => s.closePalette);
  const addToast = useUiStore((s) => s.addToast);
  const logout = useAuthStore((s) => s.logout);
  const setTheme = useAuthStore((s) => s.setTheme);
  const resetLayout = useDashboardStore((s) => s.resetLayout);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openPalette();
      }
      if (event.key === "Escape") {
        closePalette();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openPalette, closePalette]);

  useEffect(() => {
    closePalette();
  }, [location.pathname, closePalette]);

  const actions = useMemo<Action[]>(
    () => [
      { id: "go-dashboard", label: "Go to Dashboard", run: () => navigate("/app/dashboard") },
      { id: "go-events", label: "Go to Events", run: () => navigate("/app/events") },
      { id: "go-builder", label: "Go to Builder", run: () => navigate("/app/builder") },
      {
        id: "theme-light",
        label: "Set Theme: Light",
        run: () => {
          setTheme("light");
          addToast("Switched to light theme", "success");
        },
      },
      {
        id: "theme-dark",
        label: "Set Theme: Dark",
        run: () => {
          setTheme("dark");
          addToast("Switched to dark theme", "success");
        },
      },
      {
        id: "reset-layout",
        label: "Reset Widget Layout",
        run: () => {
          resetLayout();
          addToast("Dashboard layout reset", "info");
        },
      },
      {
        id: "logout",
        label: "Logout",
        run: () => {
          logout();
          navigate("/login");
        },
      },
    ],
    [navigate, setTheme, addToast, resetLayout, logout],
  );

  const filtered = actions.filter((action) => action.label.toLowerCase().includes(query.trim().toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="palette-backdrop" onClick={closePalette}>
      <section className="palette card" onClick={(event) => event.stopPropagation()}>
        <input
          autoFocus
          className="palette-input"
          placeholder="Type a command..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="palette-list">
          {filtered.map((action) => (
            <button
              key={action.id}
              className="palette-item"
              onClick={() => {
                action.run();
                closePalette();
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
        <p className="tiny">Tip: open with Ctrl+K</p>
      </section>
    </div>
  );
}
