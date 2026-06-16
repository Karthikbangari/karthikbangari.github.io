import type { ReactNode } from "react";
import { usePipeline } from "./PipelineProvider";
import { PipelineControls } from "./components/PipelineControls";
import { PipelineNavigation } from "./components/PipelineNavigation";
import { PipelineInfoPanel } from "./components/PipelineInfoPanel";
import { ApprovalGate } from "./components/ApprovalGate";
import { MonitoringPanel } from "./components/MonitoringPanel";
import { RecruiterMetrics } from "./components/RecruiterMetrics";
import { PipelineSummary } from "./components/PipelineSummary";
import styles from "./styles.module.css";

const PHASE_TONE: Record<string, string> = {
  idle: styles.banner_idle,
  running: styles.banner_run,
  paused: styles.banner_idle,
  awaitingApproval: styles.banner_warn,
  failed: styles.banner_fail,
  rollingBack: styles.banner_warn,
  completed: styles.banner_ok,
};

interface Props {
  /** Optional mode toggle bar (2D/3D) rendered under the banner. */
  modeBar?: ReactNode;
  /** Optional 3D viewport rendered above the meadow-path navigation. */
  viewport?: ReactNode;
}

/**
 * The complete 2D pipeline body. With no slots it IS the full Phase 1
 * experience and the first-class fallback; the 3D experience reuses it and
 * injects a viewport above the nav so every control/panel stays shared.
 */
export function Pipeline2D({ modeBar, viewport }: Props) {
  const { state } = usePipeline();

  return (
    <div className={styles.lab}>
      <PipelineSummary />
      <div
        className={`${styles.banner} ${PHASE_TONE[state.phase]}`}
        role="status"
        aria-live="polite"
      >
        <span className={styles.bannerPhase}>{state.phase}</span>
        <span className={styles.bannerNote}>{state.note}</span>
      </div>

      {modeBar}

      <PipelineControls />
      <ApprovalGate />

      {viewport}
      <PipelineNavigation />

      <div className={styles.workspace}>
        <PipelineInfoPanel />
        <MonitoringPanel />
      </div>

      <RecruiterMetrics />
    </div>
  );
}
