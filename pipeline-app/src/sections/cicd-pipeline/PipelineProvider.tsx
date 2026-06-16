import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { PIPELINE_STAGES } from "./pipelineConfig";
import {
  artifactLabel,
  initialState,
  reducer,
  type Action,
  type PipelineState,
} from "./state/machine";

interface PipelineContextValue {
  state: PipelineState;
  dispatch: React.Dispatch<Action>;
  artifact: string;
}

const PipelineContext = createContext<PipelineContextValue | null>(null);

const ROLLBACK_MS = 2600;

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Engine: reveal console lines while a stage runs, then complete it. ──
  // Keyed on (phase, activeIndex). A LOCAL counter avoids stale-state bugs.
  useEffect(() => {
    if (state.phase !== "running") return;
    const stage = PIPELINE_STAGES[state.activeIndex];
    const total = stage.console.length;
    let revealed = state.revealed[state.activeIndex];
    const stepMs = Math.max(260, Math.round(stage.durationMs / (total + 1)));

    const id = window.setInterval(() => {
      if (revealed < total) {
        revealed += 1;
        dispatch({ type: "REVEAL_LOG" });
      } else {
        window.clearInterval(id);
        dispatch({ type: "STAGE_DONE" });
      }
    }, stepMs);

    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.activeIndex]);

  // ── Engine: automatic rollback timer. ──
  useEffect(() => {
    if (state.phase !== "rollingBack") return;
    const id = window.setTimeout(
      () => dispatch({ type: "ROLLBACK_DONE" }),
      ROLLBACK_MS,
    );
    return () => window.clearTimeout(id);
  }, [state.phase]);

  const value = useMemo<PipelineContextValue>(
    () => ({ state, dispatch, artifact: artifactLabel(state) }),
    [state],
  );

  return (
    <PipelineContext.Provider value={value}>
      {children}
    </PipelineContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePipeline(): PipelineContextValue {
  const ctx = useContext(PipelineContext);
  if (!ctx) throw new Error("usePipeline must be used within PipelineProvider");
  return ctx;
}
