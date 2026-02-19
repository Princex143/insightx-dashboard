export type Role = "admin" | "viewer";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Metric = {
  id: string;
  label: string;
  value: number;
  unit?: string;
  deltaPct: number;
  sparkline: number[];
};

export type Severity = "critical" | "high" | "medium" | "low";

export type EventRow = {
  id: string;
  service: string;
  region: "us-east-1" | "us-west-2" | "eu-central-1" | "ap-south-1";
  severity: Severity;
  latencyMs: number;
  status: "healthy" | "degraded" | "down";
  owner: string;
  timestamp: string;
};

export type Widget = {
  id: string;
  title: string;
  type: "kpi" | "chart" | "feed" | "table";
};

export type EventFilters = {
  q: string;
  severity: Severity | "all";
  service: string | "all";
};

export type SavedView = {
  id: string;
  name: string;
  filters: EventFilters;
};
