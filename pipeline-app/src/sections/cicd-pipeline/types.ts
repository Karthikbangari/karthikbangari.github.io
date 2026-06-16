// Shared types for the CI/CD pipeline section — single source of truth.

export type StageStatus = "idle" | "running" | "success" | "failed";

export type DeployStrategy = "rolling" | "canary" | "blue-green";

/** Which simulated failure (if any) is armed; consumed when its stage runs. */
export type FailureKind = "build" | "security" | "deploy";

/** Top-level state-machine phases. */
export type Phase =
  | "idle"
  | "running"
  | "paused"
  | "awaitingApproval"
  | "failed"
  | "rollingBack"
  | "completed";

export interface PipelineStage {
  id: string;
  /** Index label shown on the nav (1..8). */
  title: string;
  tool: string;
  purpose: string;
  myResponsibility: string;
  commands: string[];
  /** Simulated log lines, revealed progressively while the stage runs. */
  console: string[];
  metrics?: Record<string, string>;
  failureBehaviour: string;
  /** Travelling-artifact label AFTER this stage succeeds. */
  artifactAfter: string;
  /** If set, this stage is the one a matching armed failure trips. */
  failsOn?: FailureKind;
  /** This stage requires manual approval before it begins. */
  requiresApproval?: boolean;
  durationMs: number;
}
