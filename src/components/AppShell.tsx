import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import { NetworkStatus } from "./NetworkStatus";

const nav = [
  { to: "/app/dashboard", label: "Dashboard" },
  { to: "/app/events", label: "Events" },
  { to: "/app/builder", label: "Builder" },
];

export function AppShell() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useAuthStore((s) => s.theme);
  const setTheme = useAuthStore((s) => s.setTheme);
  const setRole = useAuthStore((s) => s.setRole);
  const openPalette = useUiStore((s) => s.openPalette);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">InsightX</p>
          <h1>Control Tower</h1>
        </div>
        <nav>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="muted">Workspace</p>
            <strong>Northstar Retail</strong>
          </div>

          <div className="controls">
            <NetworkStatus />
            <label className="input-chip">
              Theme
              <select value={theme} onChange={(e) => setTheme(e.target.value as "light" | "dark")}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label className="input-chip">
              Role
              <select value={user?.role ?? "viewer"} onChange={(e) => setRole(e.target.value as "admin" | "viewer")}>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
            </label>
            <button
              className="button ghost"
              onClick={openPalette}
            >
              Command
            </button>
            <button
              className="button ghost"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
