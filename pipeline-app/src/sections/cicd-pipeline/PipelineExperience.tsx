import { useCallback } from "react";
import { World3DLayout } from "./World3DLayout";
import { Viewport3D } from "./components/Viewport3D";
import { usePipeline } from "./PipelineProvider";
import { PIPELINE_STAGES } from "./pipelineConfig";
import { useRenderMode } from "./hooks/useRenderMode";
import { useInView } from "./hooks/useInView";
import { useScrollGuide } from "./hooks/useScrollGuide";

/**
 * 3D-only experience: the isometric scene is the section. No 2D fallback, no
 * toggle. If WebGL truly can't start, the scene's error boundary shows why.
 */
export function PipelineExperience() {
  const { tier } = useRenderMode();
  const { state, dispatch } = usePipeline();
  const { ref, inView } = useInView<HTMLDivElement>();

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Guided camera: scroll scrubs station focus while idle (never fights Run).
  const focusStage = useCallback(
    (index: number) => dispatch({ type: "SELECT_STAGE", index }),
    [dispatch],
  );
  useScrollGuide({
    targetRef: ref,
    count: PIPELINE_STAGES.length,
    enabled: !reducedMotion && state.phase === "idle",
    onIndex: focusStage,
  });

  return (
    <div ref={ref}>
      <World3DLayout viewport={<Viewport3D active={inView} tier={tier} />} />
    </div>
  );
}
