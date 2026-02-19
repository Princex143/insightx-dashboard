import type { EventRow, Metric, Role, Severity, User } from "../types";

const owners = [
  "Alex",
  "Chris",
  "Sam",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
];
const services = [
  "Auth Gateway",
  "Billing Core",
  "Search API",
  "Insights Engine",
  "Webhook Runner",
  "Media Pipeline",
];
const regions = ["us-east-1", "us-west-2", "eu-central-1", "ap-south-1"] as const;
const severities: Severity[] = ["critical", "high", "medium", "low"];

const rand = (seed: number) => {
  const value = Math.sin(seed * 999) * 10000;
  return value - Math.floor(value);
};

const wait = async (ms = 450) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

export const login = async (
  email: string,
  password: string,
): Promise<{ token: string; user: User }> => {
  await wait();

  const catalog: Record<string, { name: string; role: Role; password: string }> = {
    "admin@insightx.dev": { name: "Avery Admin", role: "admin", password: "admin123" },
    "viewer@insightx.dev": { name: "Vera Viewer", role: "viewer", password: "viewer123" },
  };

  const account = catalog[email.toLowerCase()];
  if (!account || account.password !== password) {
    throw new Error("Invalid credentials. Try demo accounts shown on screen.");
  }

  return {
    token: `mock_token_${Date.now()}`,
    user: {
      id: email.includes("admin") ? "u_admin" : "u_viewer",
      email,
      name: account.name,
      role: account.role,
    },
  };
};

export const fetchMetrics = async (): Promise<Metric[]> => {
  await wait(300);

  return [
    makeMetric("requests", "Requests / min", 32841, "", 6.2),
    makeMetric("latency", "Avg Latency", 128, "ms", -2.4),
    makeMetric("uptime", "Uptime", 99.95, "%", 0.1),
    makeMetric("error_rate", "Error Rate", 0.74, "%", -0.3),
  ];
};

const makeMetric = (
  id: string,
  label: string,
  value: number,
  unit: string,
  deltaPct: number,
): Metric => {
  const sparkline = Array.from({ length: 16 }, (_, i) => {
    const base = Math.max(1, value / 18);
    const noise = rand(i + value) * base;
    return Number((base + noise).toFixed(2));
  });
  return { id, label, value, unit, deltaPct, sparkline };
};

const eventData: EventRow[] = Array.from({ length: 6000 }, (_, i) => {
  const severity = severities[i % severities.length];
  const status = severity === "critical" ? "down" : severity === "high" ? "degraded" : "healthy";
  return {
    id: `evt_${i + 1}`,
    service: services[i % services.length],
    region: regions[i % regions.length],
    severity,
    latencyMs: Math.round(40 + rand(i + 77) * 320),
    status,
    owner: owners[i % owners.length],
    timestamp: new Date(Date.now() - i * 11_000).toISOString(),
  };
});

type EventFilters = {
  q?: string;
  severity?: Severity | "all";
  service?: string;
};

export const fetchEvents = async (filters: EventFilters = {}): Promise<EventRow[]> => {
  await wait(500);
  const query = filters.q?.trim().toLowerCase();

  return eventData.filter((item) => {
    const matchesQuery = !query
      ? true
      : item.service.toLowerCase().includes(query) ||
        item.owner.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);
    const matchesSeverity = !filters.severity || filters.severity === "all" ? true : item.severity === filters.severity;
    const matchesService = !filters.service || filters.service === "all" ? true : item.service === filters.service;
    return matchesQuery && matchesSeverity && matchesService;
  });
};
