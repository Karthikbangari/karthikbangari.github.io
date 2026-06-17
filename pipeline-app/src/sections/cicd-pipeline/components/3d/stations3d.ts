// Presentation-only descriptors for the 3D stations, keyed by stage id, so the
// pipelineConfig stays framework-agnostic. One generic <Station> renders these.

export type StructureKind =
  | "cabin" // Source — developer's cabin
  | "mill" // CI Build — build mill (lanes light up)
  | "gate" // Quality & Security — security gate
  | "barn" // Package & Registry — container barn (layers assemble)
  | "field" // Infrastructure — blueprint field (resources rise)
  | "pods" // Deploy / EKS — sheep/pod field (pods flip)
  | "crossroads" // Release Strategy — release crossroads
  | "watchtower"; // Observability — monitoring watchtower

export interface StationVisual {
  kind: StructureKind;
  /** Accent colour for the structure roof / signature element. */
  accent: string;
}

export const STATION_VISUALS: Record<string, StationVisual> = {
  source: { kind: "cabin", accent: "#38bdf8" },
  "ci-build": { kind: "mill", accent: "#fb923c" },
  "quality-security": { kind: "gate", accent: "#34d399" },
  "package-registry": { kind: "barn", accent: "#3b82f6" },
  infrastructure: { kind: "field", accent: "#a855f7" },
  "deploy-eks": { kind: "pods", accent: "#6366f1" },
  "release-strategy": { kind: "crossroads", accent: "#fbbf24" },
  observability: { kind: "watchtower", accent: "#06b6d4" },
};

/** Status → glow/emissive colour, on-brand and gentle. */
export const STATUS_COLOR: Record<string, string> = {
  idle: "#cde6c0",
  running: "#2563eb",
  success: "#10b981",
  failed: "#e08a8a",
};
