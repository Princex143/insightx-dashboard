import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { CommandPalette } from "./components/CommandPalette";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ToastHub } from "./components/ToastHub";
import { BuilderPage } from "./pages/BuilderPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EventsPage } from "./pages/EventsPage";
import { LoginPage } from "./pages/LoginPage";
import { useAuthStore } from "./store/authStore";

function App() {
  const theme = useAuthStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="builder" element={<BuilderPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
      </Routes>
      <CommandPalette />
      <ToastHub />
    </>
  );
}

export default App;
