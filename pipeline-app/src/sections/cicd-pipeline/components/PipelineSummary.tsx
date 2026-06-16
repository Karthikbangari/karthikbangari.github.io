import { usePipeline } from "../PipelineProvider";
import { PIPELINE_STAGES } from "../pipelineConfig";
import styles from "../styles.module.css";

/**
 * Screen-reader-only summary so the whole pipeline is understandable with zero
 * animation or 3D. Mirrors the live state machine in plain prose.
 */
export function PipelineSummary() {
  const { state, artifact } = usePipeline();
  return (
    <div className={styles.srOnly}>
      <h3>CI/CD pipeline summary</h3>
      <p>
        Current phase: {state.phase}. {state.note} Travelling artifact: {artifact}.
        Release strategy: {state.strategy}.
      </p>
      <ol>
        {PIPELINE_STAGES.map((stage, i) => (
          <li key={stage.id}>
            Stage {i + 1}, {stage.title} using {stage.tool}: {state.statuses[i]}.{" "}
            {stage.purpose}
          </li>
        ))}
      </ol>
    </div>
  );
}
