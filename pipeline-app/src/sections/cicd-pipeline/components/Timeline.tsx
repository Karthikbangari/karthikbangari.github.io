import { usePipeline } from "../PipelineProvider";
import { PIPELINE_STAGES } from "../pipelineConfig";
import styles from "../styles.module.css";

/** Compact bottom timeline of station status markers (no cards). */
export function Timeline({ onSelect }: { onSelect?: (i: number) => void }) {
  const { state, dispatch } = usePipeline();
  return (
    <ol className={styles.timeline} aria-label="Pipeline timeline">
      {PIPELINE_STAGES.map((stage, i) => {
        const status = state.statuses[i];
        return (
          <li key={stage.id} className={styles.timelineItem}>
            <button
              className={[
                styles.tlMarker,
                styles[`tl_${status}`] ?? "",
                state.selectedIndex === i ? styles.tlActive : "",
              ].join(" ")}
              aria-pressed={state.selectedIndex === i}
              onClick={() => {
                dispatch({ type: "SELECT_STAGE", index: i });
                onSelect?.(i);
              }}
            >
              <span className={styles.tlDot} data-status={status} />
              <span className={styles.tlLabel}>
                <small>{String(i + 1).padStart(2, "0")}</small>
                {stage.title}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
