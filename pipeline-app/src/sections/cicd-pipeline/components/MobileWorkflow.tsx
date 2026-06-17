import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePipeline } from "../PipelineProvider";
import { PIPELINE_STAGES } from "../pipelineConfig";
import { PipelineControls } from "./PipelineControls";
import { ApprovalGate } from "./ApprovalGate";
import { PipelineInfoPanel } from "./PipelineInfoPanel";
import { MonitoringPanel } from "./MonitoringPanel";
import { RecruiterMetrics } from "./RecruiterMetrics";
import styles from "../styles.module.css";

const PHASE_TONE: Record<string, string> = {
  idle: styles.banner_idle,
  running: styles.banner_run,
  paused: styles.banner_idle,
  awaitingApproval: styles.banner_warn,
  failed: styles.banner_fail,
  rollingBack: styles.banner_warn,
  completed: styles.banner_ok,
};

const LAST = PIPELINE_STAGES.length - 1;

/**
 * Dedicated mobile journey: one station at a time, swipe or Prev/Next to move.
 * Reuses the same machine + panels as desktop — no forked logic, no 3D.
 */
export function MobileWorkflow() {
  const { state, dispatch } = usePipeline();
  const i = state.selectedIndex;
  const touchX = useRef<number | null>(null);

  const go = (delta: number) =>
    dispatch({
      type: "SELECT_STAGE",
      index: Math.max(0, Math.min(LAST, i + delta)),
    });

  return (
    <div className={styles.mobileWrap}>
      <div
        className={`${styles.banner} ${PHASE_TONE[state.phase]}`}
        role="status"
        aria-live="polite"
      >
        <span className={styles.bannerPhase}>{state.phase}</span>
        <span className={styles.bannerNote}>{state.note}</span>
      </div>

      <PipelineControls />
      <ApprovalGate />

      <div className={styles.mobileDots} role="tablist" aria-label="Stations">
        {PIPELINE_STAGES.map((stage, idx) => (
          <button
            key={stage.id}
            role="tab"
            aria-selected={idx === i}
            aria-label={`${idx + 1}. ${stage.title}`}
            className={[
              styles.mobileDot,
              styles[`dot_${state.statuses[idx]}`] ?? "",
              idx === i ? styles.mobileDotActive : "",
            ].join(" ")}
            onClick={() => dispatch({ type: "SELECT_STAGE", index: idx })}
          />
        ))}
      </div>

      <div className={styles.mobileNavRow}>
        <button
          className={styles.btnGhost}
          onClick={() => go(-1)}
          disabled={i === 0}
          aria-label="Previous station"
        >
          <ChevronLeft size={16} aria-hidden /> Prev
        </button>
        <span className={styles.mobileCount}>
          Station {i + 1} / {PIPELINE_STAGES.length}
        </span>
        <button
          className={styles.btnGhost}
          onClick={() => go(1)}
          disabled={i === LAST}
          aria-label="Next station"
        >
          Next <ChevronRight size={16} aria-hidden />
        </button>
      </div>

      <div
        className={styles.mobileJourney}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <PipelineInfoPanel />
      </div>

      <MonitoringPanel />
      <RecruiterMetrics />
    </div>
  );
}
