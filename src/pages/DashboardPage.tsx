import { useQuery } from "@tanstack/react-query";
import { fetchMetrics } from "../api/mockApi";
import { MetricCard } from "../components/MetricCard";
import { WidgetBoard } from "../components/WidgetBoard";
import { useDashboardStore } from "../store/dashboardStore";

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["metrics"],
    queryFn: fetchMetrics,
  });
  const widgets = useDashboardStore((s) => s.widgets);
  const reorderWidgets = useDashboardStore((s) => s.reorderWidgets);

  return (
    <div className="stack">
      <section className="kpi-grid">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <article key={index} className="card skeleton" />
          ))
        ) : (
          data?.map((metric) => <MetricCard key={metric.id} metric={metric} />)
        )}
      </section>

      <section>
        <div className="section-head">
          <h2>Layout Builder</h2>
          <p className="muted">Drag cards to customize the order of dashboard modules.</p>
        </div>
        <WidgetBoard widgets={widgets} onReorder={reorderWidgets} />
      </section>
    </div>
  );
}
