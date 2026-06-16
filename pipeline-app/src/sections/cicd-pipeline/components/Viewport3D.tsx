import { lazy, Suspense, useCallback } from "react";
import { PipelineLoader } from "./PipelineLoader";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import { usePipeline } from "../PipelineProvider";
import type { QualityTier } from "../hooks/useRenderMode";
import styles from "../styles.module.css";

// Lazy boundary: three.js + R3F + drei only download when 3D is actually shown.
const PipelineScene = lazy(() => import("./3d/PipelineScene"));

interface Props {
  active: boolean;
  tier: QualityTier;
  /** Called if the 3D scene fails so the parent can switch to 2D. */
  onSceneError?: () => void;
}

export function Viewport3D({ active, tier, onSceneError }: Props) {
  // Read provider state on the DOM side and pass it into the Canvas (separate
  // reconciler) as props — a clean bridge without context hacks.
  const { state, dispatch, artifact } = usePipeline();
  const onSelect = useCallback(
    (index: number) => dispatch({ type: "SELECT_STAGE", index }),
    [dispatch],
  );

  return (
    <div className={styles.stage} aria-label="3D valley pipeline scene">
      <SceneErrorBoundary
        onError={onSceneError}
        fallback={
          <div className={styles.stageFallback}>
            3D scene unavailable on this device — the interactive 2D pipeline
            below has full parity.
          </div>
        }
      >
        <Suspense fallback={<PipelineLoader />}>
          <PipelineScene
            active={active}
            statuses={state.statuses}
            activeIndex={state.activeIndex}
            selectedIndex={state.selectedIndex}
            phase={state.phase}
            strategy={state.strategy}
            rolledBack={state.rolledBack}
            artifact={artifact}
            tier={tier}
            onSelect={onSelect}
          />
        </Suspense>
      </SceneErrorBoundary>
      <span className={styles.stageBadge}>Karthik Valley OS · live 3D</span>
    </div>
  );
}
