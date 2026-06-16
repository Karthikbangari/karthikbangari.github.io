// Single public entry component for "Inside My CI/CD Pipeline".
// Phase 1: full config-driven 2D pipeline + state machine.
// Phase 2+ will add a gated, lazy 3D scene that reuses this same provider.
import { PipelineProvider } from "./PipelineProvider";
import { PipelineExperience } from "./PipelineExperience";
import styles from "./styles.module.css";

export function CICDPipelineSection() {
  return (
    <div className={styles.section}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.kicker}>
            Karthik Valley OS · CI/CD Meadow Path
          </span>
          <h2 className={styles.title}>Inside My CI/CD Pipeline</h2>
          <p className={styles.copy}>
            An interactive walk-through of a production-grade CI/CD + DevSecOps
            workflow — from a developer’s commit through build, security,
            packaging, infrastructure, EKS deployment, progressive release, and
            live observability. Run it, pause it, break it, and watch it recover.
          </p>
        </header>

        <PipelineProvider>
          <PipelineExperience />
        </PipelineProvider>
      </div>
    </div>
  );
}
