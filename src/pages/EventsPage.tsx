import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../api/mockApi";
import { VirtualizedEventTable } from "../components/VirtualizedEventTable";
import { useDashboardStore } from "../store/dashboardStore";
import { useUiStore } from "../store/uiStore";

const services = ["all", "Auth Gateway", "Billing Core", "Search API", "Insights Engine", "Webhook Runner", "Media Pipeline"];

export function EventsPage() {
  const eventFilters = useDashboardStore((s) => s.eventFilters);
  const updateEventFilters = useDashboardStore((s) => s.updateEventFilters);
  const savedViews = useDashboardStore((s) => s.savedViews);
  const saveCurrentView = useDashboardStore((s) => s.saveCurrentView);
  const applySavedView = useDashboardStore((s) => s.applySavedView);
  const deleteSavedView = useDashboardStore((s) => s.deleteSavedView);
  const addToast = useUiStore((s) => s.addToast);

  const { data = [], isFetching } = useQuery({
    queryKey: ["events", eventFilters],
    queryFn: () => fetchEvents(eventFilters),
    refetchInterval: 9_000,
  });

  const saveView = () => {
    const name = window.prompt("Saved view name");
    if (!name?.trim()) return;
    saveCurrentView(name.trim());
    addToast(`Saved view: ${name.trim()}`, "success");
  };

  const exportCsv = () => {
    const header = "id,service,severity,latencyMs,region,owner,status,timestamp";
    const lines = data.map((row) =>
      [row.id, row.service, row.severity, row.latencyMs, row.region, row.owner, row.status, row.timestamp]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `insightx-events-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addToast("Exported filtered rows to CSV", "info");
  };

  return (
    <div className="stack">
      <section className="card filter-row">
        <label>
          Search
          <input
            value={eventFilters.q}
            onChange={(event) => updateEventFilters({ q: event.target.value })}
            placeholder="Search event ID, owner, service"
          />
        </label>
        <label>
          Severity
          <select
            value={eventFilters.severity}
            onChange={(event) =>
              updateEventFilters({
                severity: event.target.value as "all" | "critical" | "high" | "medium" | "low",
              })
            }
          >
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
        <label>
          Service
          <select
            value={eventFilters.service}
            onChange={(event) => updateEventFilters({ service: event.target.value })}
          >
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </label>
        <div className="filter-actions">
          <button className="button ghost" onClick={saveView}>
            Save View
          </button>
          <button className="button ghost" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
      </section>
      {savedViews.length > 0 ? (
        <section className="card saved-views">
          {savedViews.map((view) => (
            <div key={view.id} className="saved-view-row">
              <button className="button ghost" onClick={() => applySavedView(view.id)}>
                {view.name}
              </button>
              <button
                className="button ghost"
                onClick={() => {
                  deleteSavedView(view.id);
                  addToast(`Removed view: ${view.name}`, "info");
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </section>
      ) : null}

      <section>
        <div className="section-head">
          <h2>Live Event Stream</h2>
          <p className="muted">
            {isFetching ? "Refreshing..." : `${data.length.toLocaleString()} rows`} rendered with manual row virtualization.
          </p>
        </div>
        <VirtualizedEventTable rows={data} />
      </section>
    </div>
  );
}
