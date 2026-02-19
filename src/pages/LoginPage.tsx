import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function LoginPage() {
  const [email, setEmail] = useState("admin@insightx.dev");
  const [password, setPassword] = useState("admin123");
  const authenticate = useAuthStore((s) => s.authenticate);
  const error = useAuthStore((s) => s.error);
  const isAuthenticating = useAuthStore((s) => s.isAuthenticating);
  const token = useAuthStore((s) => s.token);
  const theme = useAuthStore((s) => s.theme);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (token) {
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from ?? "/app/dashboard", { replace: true });
    }
  }, [token, navigate, location.state]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await authenticate(email, password);
  };

  return (
    <div className="login-page">
      <div className="login-panel card">
        <p className="eyebrow">InsightX Platform</p>
        <h1>Sign into Control Tower</h1>
        <p className="muted">Frontend-only enterprise simulation with mocked API + persisted session.</p>

        <form onSubmit={onSubmit}>
          <label>
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@insightx.dev"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="admin123"
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button className="button" disabled={isAuthenticating} type="submit">
            {isAuthenticating ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="tiny">Demo users: admin@insightx.dev / admin123 and viewer@insightx.dev / viewer123</p>
      </div>
    </div>
  );
}
