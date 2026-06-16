import { CheckCircle2 } from "lucide-react";
import { PIPELINE_DEMONSTRATES, PIPELINE_OUTCOMES } from "../pipelineConfig";
import styles from "../styles.module.css";

export function RecruiterMetrics() {
  return (
    <div className={styles.recruiter}>
      <div className={styles.recruiterCol}>
        <h3 className={styles.recruiterTitle}>What This Pipeline Demonstrates</h3>
        <ul className={styles.demoList}>
          {PIPELINE_DEMONSTRATES.map((item) => (
            <li key={item}>
              <CheckCircle2 size={15} aria-hidden /> {item}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.outcomeGrid}>
        {PIPELINE_OUTCOMES.map((o) => (
          <div key={o.label} className={styles.outcomeCard}>
            <strong>{o.value}</strong>
            <small>{o.label}</small>
          </div>
        ))}
        <p className={styles.outcomeNote}>portfolio demonstration metrics</p>
      </div>
    </div>
  );
}
