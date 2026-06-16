import {
  GitBranch,
  Wrench,
  ShieldCheck,
  Boxes,
  Layers,
  Ship,
  GitMerge,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { usePipeline } from "../PipelineProvider";
import { PIPELINE_STAGES } from "../pipelineConfig";
import styles from "../styles.module.css";

// Valley structures, one per station, in pipeline order.
const STATION_ICONS: LucideIcon[] = [
  GitBranch, // Source — developer's cabin
  Wrench, // CI Build — build mill
  ShieldCheck, // Quality & Security — quality/security gate
  Boxes, // Package & Registry — container barn
  Layers, // Infrastructure — infrastructure field
  Ship, // Deploy / EKS — Kubernetes sheep field
  GitMerge, // Release Strategy — release crossroads
  Activity, // Observability — monitoring watchtower
];

export function PipelineNavigation() {
  const { state, dispatch, artifact } = usePipeline();
  const { statuses, activeIndex, selectedIndex, phase } = state;

  // Artifact position: furthest active/successful station along the path.
  const lastDone = statuses.lastIndexOf("success");
  const cursor =
    phase === "completed" ? PIPELINE_STAGES.length - 1 : Math.max(activeIndex, lastDone);
  const pct =
    PIPELINE_STAGES.length > 1
      ? (cursor / (PIPELINE_STAGES.length - 1)) * 100
      : 0;

  return (
    <div className={styles.navWrap}>
      <div className={styles.pathTrack}>
        <div className={styles.pathFill} style={{ width: `${pct}%` }} />
        <div
          className={`${styles.artifact} ${phase === "running" ? styles.artifactMoving : ""}`}
          style={{ left: `${pct}%` }}
          aria-hidden
        >
          <span className={styles.artifactDot} />
          <span className={styles.artifactLabel}>{artifact}</span>
        </div>
      </div>

      <ol className={styles.stations}>
        {PIPELINE_STAGES.map((stage, i) => {
          const Icon = STATION_ICONS[i];
          const status = statuses[i];
          return (
            <li key={stage.id} className={styles.stationItem}>
              <button
                className={[
                  styles.station,
                  styles[`station_${status}`],
                  selectedIndex === i ? styles.stationSelected : "",
                ].join(" ")}
                onClick={() => dispatch({ type: "SELECT_STAGE", index: i })}
                aria-pressed={selectedIndex === i}
              >
                <span className={styles.stationIcon}>
                  <Icon size={18} aria-hidden />
                </span>
                <span className={styles.stationMeta}>
                  <small>
                    {String(i + 1).padStart(2, "0")} · {stage.tool}
                  </small>
                  <strong>{stage.title}</strong>
                </span>
                <span className={styles.stationStatus} data-status={status} />
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
