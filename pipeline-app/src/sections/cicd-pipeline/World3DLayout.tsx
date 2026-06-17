import { useEffect, useState, type ReactNode } from "react";
import { usePipeline } from "./PipelineProvider";
import { PipelineControls } from "./components/PipelineControls";
import { ApprovalGate } from "./components/ApprovalGate";
import { Timeline } from "./components/Timeline";
import { InfoDrawer } from "./components/InfoDrawer";
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

/**
 * 3D-hero layout: the scene fills the frame; controls, timeline, metrics and the
 * recruiter block sit compactly BELOW it; station details live in a slide-in
 * drawer that opens on select. No card row inside the scene area.
 */
export function World3DLayout({
  modeBar,
  viewport,
}: {
  modeBar: ReactNode;
  viewport: ReactNode;
}) {
  const { state } = usePipeline();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Open the drawer when the user lands on a station (not during auto-run).
  useEffect(() => {
    if (state.phase !== "running") setDrawerOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedIndex]);

  // Surface approval / failure automatically.
  useEffect(() => {
    if (state.phase === "awaitingApproval" || state.phase === "failed") {
      setDrawerOpen(true);
    }
  }, [state.phase]);

  return (
    <div className={styles.world}>
      <PipelineSummary />

      <div className={styles.worldTopRow}>
        <div className={`${styles.miniBanner} ${PHASE_TONE[state.phase]}`} role="status" aria-live="polite">
          <span className={styles.bannerPhase}>{state.phase}</span>
          <span className={styles.bannerNote}>{state.note}</span>
        </div>
        {modeBar}
      </div>

      {/* Hero scene */}
      <div className={styles.hero}>
        {viewport}
        <InfoDrawer
          open={drawerOpen}
          onOpen={() => setDrawerOpen(true)}
          onClose={() => setDrawerOpen(false)}
        />
      </div>

      <ApprovalGate />
      <PipelineControls />
      <Timeline onSelect={() => setDrawerOpen(true)} />

      <MonitoringPanel />
      <RecruiterMetrics />
    </div>
  );
}
