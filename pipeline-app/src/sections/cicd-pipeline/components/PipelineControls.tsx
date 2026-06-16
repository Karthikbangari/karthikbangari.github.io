import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Hammer,
  ShieldAlert,
  CloudOff,
} from "lucide-react";
import { usePipeline } from "../PipelineProvider";
import type { DeployStrategy } from "../types";
import styles from "../styles.module.css";

const STRATEGIES: { id: DeployStrategy; label: string }[] = [
  { id: "rolling", label: "Rolling" },
  { id: "canary", label: "Canary" },
  { id: "blue-green", label: "Blue-Green" },
];

export function PipelineControls() {
  const { state, dispatch } = usePipeline();
  const { phase, strategy } = state;

  const running = phase === "running";
  const paused = phase === "paused";
  const busy = running || phase === "rollingBack";

  return (
    <div className={styles.controls}>
      <div className={styles.controlGroup}>
        <button
          className={styles.btnPrimary}
          onClick={() => dispatch({ type: "RUN" })}
          disabled={busy}
        >
          <Play size={15} aria-hidden /> Run
        </button>

        {running ? (
          <button
            className={styles.btn}
            onClick={() => dispatch({ type: "PAUSE" })}
          >
            <Pause size={15} aria-hidden /> Pause
          </button>
        ) : (
          <button
            className={styles.btn}
            onClick={() => dispatch({ type: "RESUME" })}
            disabled={!paused}
          >
            <Play size={15} aria-hidden /> Resume
          </button>
        )}

        <button
          className={styles.btn}
          onClick={() => dispatch({ type: "RESET" })}
        >
          <RotateCcw size={15} aria-hidden /> Restart
        </button>

        <button
          className={styles.btnGhost}
          onClick={() => dispatch({ type: "PREV" })}
          disabled={busy}
          aria-label="Previous stage"
        >
          <ChevronLeft size={15} aria-hidden /> Prev
        </button>
        <button
          className={styles.btnGhost}
          onClick={() => dispatch({ type: "NEXT" })}
          disabled={busy}
          aria-label="Next stage"
        >
          Next <ChevronRight size={15} aria-hidden />
        </button>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>Strategy</span>
        <div className={styles.segmented} role="group" aria-label="Release strategy">
          {STRATEGIES.map((s) => (
            <button
              key={s.id}
              className={`${styles.segment} ${strategy === s.id ? styles.segmentActive : ""}`}
              aria-pressed={strategy === s.id}
              onClick={() => dispatch({ type: "SET_STRATEGY", strategy: s.id })}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>Simulate</span>
        <button
          className={styles.btnWarn}
          onClick={() => dispatch({ type: "RUN", failure: "build" })}
          disabled={busy}
        >
          <Hammer size={14} aria-hidden /> Failed Build
        </button>
        <button
          className={styles.btnWarn}
          onClick={() => dispatch({ type: "RUN", failure: "security" })}
          disabled={busy}
        >
          <ShieldAlert size={14} aria-hidden /> Security Failure
        </button>
        <button
          className={styles.btnWarn}
          onClick={() => dispatch({ type: "RUN", failure: "deploy" })}
          disabled={busy}
        >
          <CloudOff size={14} aria-hidden /> Failed Deploy → Rollback
        </button>
      </div>
    </div>
  );
}
