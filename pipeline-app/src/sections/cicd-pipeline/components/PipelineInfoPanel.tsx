import { Terminal, UserCheck, AlertTriangle } from "lucide-react";
import { usePipeline } from "../PipelineProvider";
import { PIPELINE_STAGES } from "../pipelineConfig";
import styles from "../styles.module.css";

export function PipelineInfoPanel() {
  const { state } = usePipeline();
  const i = state.selectedIndex;
  const stage = PIPELINE_STAGES[i];
  const status = state.statuses[i];
  const shownLogs = stage.console.slice(0, state.revealed[i]);

  return (
    <div className={styles.infoPanel}>
      <header className={styles.infoHead}>
        <div>
          <span className={styles.infoKicker}>
            Station {String(i + 1).padStart(2, "0")} · {stage.tool}
          </span>
          <h3 className={styles.infoTitle}>{stage.title}</h3>
        </div>
        <span className={`${styles.statusPill} ${styles[`pill_${status}`]}`}>
          {status}
        </span>
      </header>

      <p className={styles.infoPurpose}>{stage.purpose}</p>

      <div className={styles.infoRow}>
        <UserCheck size={15} aria-hidden />
        <p>
          <strong>My responsibility:</strong> {stage.myResponsibility}
        </p>
      </div>

      <div className={styles.codeBlock} aria-label="Commands">
        {stage.commands.map((cmd, idx) => (
          <div key={idx} className={styles.codeLine}>
            <span className={styles.prompt}>$</span> {cmd}
          </div>
        ))}
      </div>

      <div className={styles.terminal}>
        <div className={styles.terminalBar}>
          <Terminal size={13} aria-hidden /> live output — {stage.tool}
        </div>
        <div className={styles.terminalBody}>
          {shownLogs.length === 0 ? (
            <div className={styles.terminalMuted}>
              awaiting execution… run the pipeline to stream output
            </div>
          ) : (
            shownLogs.map((line, idx) => (
              <div key={idx} className={styles.logLine}>
                {line}
              </div>
            ))
          )}
        </div>
      </div>

      {stage.metrics && (
        <div className={styles.metricRow}>
          {Object.entries(stage.metrics).map(([k, v]) => (
            <div key={k} className={styles.metricChip}>
              <small>{k}</small>
              <strong>{v}</strong>
            </div>
          ))}
        </div>
      )}

      <div className={styles.failNote}>
        <AlertTriangle size={14} aria-hidden />
        <span>
          <strong>On failure:</strong> {stage.failureBehaviour}
        </span>
      </div>
    </div>
  );
}
