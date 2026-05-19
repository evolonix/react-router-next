export interface Org {
  id: string;
  name: string;
  blurb: string;
}

export interface Project {
  id: string;
  orgId: string;
  name: string;
  summary: string;
  hue: number;
  status: "shipping" | "in-review" | "drafting";
}

export const ORGS: Org[] = [
  { id: "acme", name: "Acme", blurb: "Logistics, slightly cartoonish." },
  { id: "lumen", name: "Lumen", blurb: "Solar and storage tooling." },
  { id: "vela", name: "Vela", blurb: "Marine charting for small fleets." },
];

export const PROJECTS: Project[] = [
  {
    id: "atlas",
    orgId: "acme",
    name: "Atlas",
    summary: "Real-time tracking dashboards.",
    hue: 220,
    status: "shipping",
  },
  {
    id: "anvil",
    orgId: "acme",
    name: "Anvil",
    summary: "Warehouse heat-map experiments.",
    hue: 30,
    status: "in-review",
  },
  {
    id: "halo",
    orgId: "lumen",
    name: "Halo",
    summary: "Inverter monitoring redesign.",
    hue: 60,
    status: "shipping",
  },
  {
    id: "prism",
    orgId: "lumen",
    name: "Prism",
    summary: "New battery-spec import flow.",
    hue: 280,
    status: "drafting",
  },
  {
    id: "tide",
    orgId: "vela",
    name: "Tide",
    summary: "Offline tile sync for charts.",
    hue: 190,
    status: "in-review",
  },
  {
    id: "compass",
    orgId: "vela",
    name: "Compass",
    summary: "Crew handoff templates.",
    hue: 140,
    status: "drafting",
  },
];

export function getOrg(id: string): Org | null {
  return ORGS.find((o) => o.id === id) ?? null;
}

export function getProjectsForOrg(orgId: string): Project[] {
  return PROJECTS.filter((p) => p.orgId === orgId);
}

export function getProject(orgId: string, projectId: string): Project | null {
  return PROJECTS.find((p) => p.orgId === orgId && p.id === projectId) ?? null;
}
