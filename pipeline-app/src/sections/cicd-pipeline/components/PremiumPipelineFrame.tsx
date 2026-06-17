import type { ReactNode } from "react";
import { Radio, Terminal } from "lucide-react";
import { usePipeline } from "../PipelineProvider";
import { PIPELINE_STAGES } from "../pipelineConfig";
import styles from "../styles.module.css";

const TOOL_TAGS = [
  "GitHub",
  "Jenkins",
  "SonarQube",
  "Snyk",
  "Docker",
  "ECR",
  "Terraform",
  "EKS",
  "Prometheus",
  "Grafana",
];

/**
 * Luxury frame around the whole experience: frosted header (title + LIVE badge
 * + tool tags) and a bottom live-log + metrics strip. Reads the live machine
 * for the strip; the children render the actual scene/controls.
 */
export function PremiumPipelineFrame({ children }: { children: ReactNode }) {
  const { state } = usePipeline();
  const active = PIPELINE_STAGES[state.activeIndex];
  const latestLog =
    state.revealed[state.activeIndex] > 0
      ? active.console[state.revealed[state.activeIndex] - 1]
      : "pipeline idle — press Run to deploy commit → production";
  const stripMetrics = Object.entries(active.metrics ?? {}).slice(0, 3);

  return (
    <div className={styles.frame}>
      <header className={styles.frameHeader}>
        <div className={styles.frameTitleWrap}>
          <h2 className={styles.frameTitle}>Production CI/CD Workflow</h2>
          <span className={styles.liveBadge}>
            <Radio size={11} aria-hidden /> LIVE • v2.4.1
          </span>
        </div>
        <div className={styles.toolTags} aria-label="Toolchain">
          {TOOL_TAGS.map((t) => (
            <span key={t} className={styles.toolTag}>
              {t}
            </span>
          ))}
        </div>
      </header>

      <div className={styles.frameBody}>{children}</div>

      <footer className={styles.frameStrip}>
        <div className={styles.stripLog}>
          <span className={styles.stripLogLabel}>
            <Terminal size={12} aria-hidden /> {active.tool}
          </span>
          <span className={styles.stripLogLine} title={latestLog}>
            {latestLog}
          </span>
        </div>
        <div className={styles.stripMetrics}>
          {stripMetrics.map(([k, v]) => (
            <span key={k} className={styles.stripMetric}>
              <small>{k}</small>
              <strong>{v}</strong>
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
