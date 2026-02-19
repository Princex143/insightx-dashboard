import { useMemo, useState } from "react";
import type { EventRow } from "../types";

type Props = {
  rows: EventRow[];
};

const ROW_HEIGHT = 40;
const VIEWPORT_HEIGHT = 420;

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function VirtualizedEventTable({ rows }: Props) {
  const [scrollTop, setScrollTop] = useState(0);
  const totalHeight = rows.length * ROW_HEIGHT;
  const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 8);
  const visibleCount = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT) + 16;
  const end = Math.min(rows.length, start + visibleCount);

  const visible = useMemo(() => rows.slice(start, end), [rows, start, end]);

  return (
    <section className="table-shell">
      <div className="table-head">
        <span>ID</span>
        <span>Service</span>
        <span>Severity</span>
        <span>Latency</span>
        <span>Region</span>
        <span>Owner</span>
        <span>Timestamp</span>
      </div>

      <div
        className="table-viewport"
        style={{ height: VIEWPORT_HEIGHT }}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          {visible.map((row, index) => {
            const top = (start + index) * ROW_HEIGHT;
            return (
              <div
                key={row.id}
                className="table-row"
                style={{ transform: `translateY(${top}px)` }}
              >
                <span>{row.id}</span>
                <span>{row.service}</span>
                <span>
                  <i className={`pill ${row.severity}`}>{row.severity}</i>
                </span>
                <span>{row.latencyMs}ms</span>
                <span>{row.region}</span>
                <span>{row.owner}</span>
                <span>{formatDate(row.timestamp)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
