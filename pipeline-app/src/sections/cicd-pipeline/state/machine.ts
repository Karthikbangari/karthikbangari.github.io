import type {
  DeployStrategy,
  FailureKind,
  Phase,
  StageStatus,
} from "../types";
import { PIPELINE_STAGES } from "../pipelineConfig";

const LAST = PIPELINE_STAGES.length - 1;

export interface PipelineState {
  phase: Phase;
  /** Stage currently running / most recently acted on. */
  activeIndex: number;
  /** Stage whose info panel is open (independent of the run). */
  selectedIndex: number;
  statuses: StageStatus[];
  /** Count of console lines revealed per stage. */
  revealed: number[];
  strategy: DeployStrategy;
  /** Armed failure consumed when its stage completes. */
  armedFailure: FailureKind | null;
  /** Stage index awaiting manual approval, or null. */
  approvalFor: number | null;
  rolledBack: boolean;
  note: string;
}

export type Action =
  | { type: "RUN"; failure?: FailureKind }
  | { type: "RESET" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SELECT_STAGE"; index: number }
  | { type: "SET_STRATEGY"; strategy: DeployStrategy }
  | { type: "REVEAL_LOG" }
  | { type: "STAGE_DONE" }
  | { type: "APPROVE" }
  | { type: "REJECT" }
  | { type: "ROLLBACK_DONE" };

const idleStatuses = (): StageStatus[] => PIPELINE_STAGES.map(() => "idle");
const zeroRevealed = (): number[] => PIPELINE_STAGES.map(() => 0);

export const initialState: PipelineState = {
  phase: "idle",
  activeIndex: 0,
  selectedIndex: 0,
  statuses: idleStatuses(),
  revealed: zeroRevealed(),
  strategy: "rolling",
  armedFailure: null,
  approvalFor: null,
  rolledBack: false,
  note: "Pipeline idle — press Run to deploy commit → production.",
};

/** Deterministic scrub: stages before `index` are done, `index` is the cursor. */
const scrubTo = (state: PipelineState, index: number): PipelineState => {
  const statuses = PIPELINE_STAGES.map<StageStatus>((_, i) =>
    i < index ? "success" : i === index ? "running" : "idle",
  );
  const revealed = PIPELINE_STAGES.map((s, i) =>
    i < index ? s.console.length : 0,
  );
  return {
    ...state,
    phase: "paused",
    activeIndex: index,
    selectedIndex: index,
    statuses,
    revealed,
    approvalFor: null,
    note: `Paused at “${PIPELINE_STAGES[index].title}” — Resume to continue.`,
  };
};

const startRunning = (
  base: PipelineState,
  failure: FailureKind | null,
): PipelineState => {
  const statuses = idleStatuses();
  statuses[0] = "running";
  return {
    ...base,
    phase: "running",
    activeIndex: 0,
    selectedIndex: 0,
    statuses,
    revealed: zeroRevealed(),
    armedFailure: failure,
    approvalFor: null,
    rolledBack: false,
    note: failure
      ? `Running with simulated ${failure} failure armed…`
      : "Pipeline running — commit travelling through the valley…",
  };
};

export function reducer(state: PipelineState, action: Action): PipelineState {
  switch (action.type) {
    case "RUN":
      return startRunning(state, action.failure ?? null);

    case "RESET":
      return { ...initialState, strategy: state.strategy };

    case "PAUSE":
      if (state.phase !== "running") return state;
      return {
        ...state,
        phase: "paused",
        note: `Paused at “${PIPELINE_STAGES[state.activeIndex].title}”.`,
      };

    case "RESUME":
      if (state.phase !== "paused") return state;
      return {
        ...state,
        phase: "running",
        note: "Resumed — pipeline running…",
      };

    case "NEXT":
      return scrubTo(state, Math.min(state.activeIndex + 1, LAST));

    case "PREV":
      return scrubTo(state, Math.max(state.activeIndex - 1, 0));

    case "SELECT_STAGE":
      return { ...state, selectedIndex: action.index };

    case "SET_STRATEGY":
      return { ...state, strategy: action.strategy };

    case "REVEAL_LOG": {
      if (state.phase !== "running") return state;
      const i = state.activeIndex;
      const max = PIPELINE_STAGES[i].console.length;
      if (state.revealed[i] >= max) return state;
      const revealed = state.revealed.slice();
      revealed[i] = revealed[i] + 1;
      return { ...state, revealed };
    }

    case "STAGE_DONE": {
      if (state.phase !== "running") return state;
      const i = state.activeIndex;
      const stage = PIPELINE_STAGES[i];
      const statuses = state.statuses.slice();
      const revealed = state.revealed.slice();
      revealed[i] = stage.console.length;

      // Armed failure trips on its stage.
      if (state.armedFailure && stage.failsOn === state.armedFailure) {
        statuses[i] = "failed";
        if (state.armedFailure === "deploy") {
          return {
            ...state,
            statuses,
            revealed,
            armedFailure: null,
            phase: "rollingBack",
            note: "Deployment unhealthy — automatic rollback in progress…",
          };
        }
        return {
          ...state,
          statuses,
          revealed,
          armedFailure: null,
          phase: "failed",
          selectedIndex: i,
          note: `Pipeline failed at “${stage.title}”. ${stage.failureBehaviour}`,
        };
      }

      statuses[i] = "success";
      const next = i + 1;

      if (next > LAST) {
        return {
          ...state,
          statuses,
          revealed,
          phase: "completed",
          note: "Release healthy — commit is live and observed in production. ✅",
        };
      }

      if (PIPELINE_STAGES[next].requiresApproval) {
        return {
          ...state,
          statuses,
          revealed,
          phase: "awaitingApproval",
          approvalFor: next,
          note: `Approval required before “${PIPELINE_STAGES[next].title}”.`,
        };
      }

      statuses[next] = "running";
      return {
        ...state,
        statuses,
        revealed,
        activeIndex: next,
        selectedIndex: next,
        note: `Running “${PIPELINE_STAGES[next].title}” (${PIPELINE_STAGES[next].tool})…`,
      };
    }

    case "APPROVE": {
      if (state.phase !== "awaitingApproval" || state.approvalFor === null)
        return state;
      const next = state.approvalFor;
      const statuses = state.statuses.slice();
      statuses[next] = "running";
      return {
        ...state,
        phase: "running",
        activeIndex: next,
        selectedIndex: next,
        statuses,
        approvalFor: null,
        note: `Approved — deploying “${PIPELINE_STAGES[next].title}”…`,
      };
    }

    case "REJECT": {
      if (state.phase !== "awaitingApproval") return state;
      return {
        ...state,
        phase: "failed",
        note: "Release rejected at the approval gate — deployment cancelled.",
      };
    }

    case "ROLLBACK_DONE": {
      const statuses = state.statuses.slice();
      const deployIndex = PIPELINE_STAGES.findIndex(
        (s) => s.failsOn === "deploy",
      );
      if (deployIndex >= 0) statuses[deployIndex] = "idle";
      return {
        ...state,
        statuses,
        phase: "completed",
        rolledBack: true,
        note: "Automatic rollback complete — previous stable version is serving traffic. 🛡️",
      };
    }

    default:
      return state;
  }
}

/** Travelling-artifact label derived from the furthest successful stage. */
export const artifactLabel = (state: PipelineState): string => {
  let label = "commit";
  for (let i = 0; i < PIPELINE_STAGES.length; i += 1) {
    if (state.statuses[i] === "success") label = PIPELINE_STAGES[i].artifactAfter;
  }
  return label;
};
