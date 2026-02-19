import { useAuthStore } from "../store/authStore";
import { useDashboardStore } from "../store/dashboardStore";

export function BuilderPage() {
  const role = useAuthStore((s) => s.user?.role ?? "viewer");
  const widgets = useDashboardStore((s) => s.widgets);
  const resetLayout = useDashboardStore((s) => s.resetLayout);

  return (
    <div className="stack">
      <section className="card">
        <h2>Workflow Builder</h2>
        <p className="muted">
          Simulates role-based feature gates and offline-safe local persistence.
        </p>
        <div className="builder-grid">
          <article className="tile">
            <h3>Rule Editor</h3>
            <p className="tiny">Create if/then routing for incident escalations and paging policy.</p>
          </article>
          <article className="tile">
            <h3>Actions</h3>
            <p className="tiny">Email, webhook, Slack bridge, and auto-ticket creation actions.</p>
          </article>
          <article className="tile">
            <h3>Versioning</h3>
            <p className="tiny">Draft + publish modes for controlled rollout in a mock environment.</p>
          </article>
        </div>
      </section>

      <section className="card">
        <h3>Role Gate</h3>
        {role === "admin" ? (
          <p className="tiny">
            Admin mode active. You can publish workflows and reset shared dashboard layout.
          </p>
        ) : (
          <p className="tiny">
            Viewer mode active. You can inspect flows but cannot publish or modify protected settings.
          </p>
        )}
        <button className="button" onClick={resetLayout} disabled={role !== "admin"}>
          Reset Widget Layout
        </button>
      </section>

      <section className="card">
        <h3>Current Widget JSON</h3>
        <pre className="code-block">{JSON.stringify(widgets, null, 2)}</pre>
      </section>
    </div>
  );
}
