import type { Metric } from "../types";

type Props = {
  metric: Metric;
};

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export function MetricCard({ metric }: Props) {
  const displayValue =
    metric.value >= 1000 && metric.unit !== "%" ? `${compact.format(metric.value)}${metric.unit ?? ""}` : `${metric.value}${metric.unit ?? ""}`;

  const points = metric.sparkline
    .map((value, i) => `${(i / (metric.sparkline.length - 1)) * 100},${100 - value}`)
    .join(" ");

  return (
    <article className="card metric-card">
      <p className="muted">{metric.label}</p>
      <p className="metric-value">{displayValue}</p>
      <p className={metric.deltaPct >= 0 ? "delta positive" : "delta negative"}>
        {metric.deltaPct >= 0 ? "+" : ""}
        {metric.deltaPct}%
      </p>
      <svg className="sparkline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <polyline points={points} />
      </svg>
    </article>
  );
}
