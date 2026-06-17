import { useCallback } from "react";
import { Pipeline2D } from "./Pipeline2D";
import { World3DLayout } from "./World3DLayout";
import { ExperienceBar } from "./components/ExperienceBar";
import { Viewport3D } from "./components/Viewport3D";
import { MobileWorkflow } from "./components/MobileWorkflow";
import { usePipeline } from "./PipelineProvider";
import { PIPELINE_STAGES } from "./pipelineConfig";
import { useRenderMode } from "./hooks/useRenderMode";
import { useInView } from "./hooks/useInView";
import { useIsMobile } from "./hooks/useIsMobile";
import { useScrollGuide } from "./hooks/useScrollGuide";

/**
 * Chooses the experience: a dedicated guided journey on phones, otherwise the
 * desktop pipeline with a 3D scene (on capable devices) or the 2D fallback.
 * Every variant shares the same controls, panels, and state machine.
 */
export function PipelineExperience() {
  const { mode, canRender3D, tier, ready, setMode } = useRenderMode();
  const { state, dispatch } = usePipeline();
  const { ref, inView } = useInView<HTMLDivElement>();
  const isMobile = useIsMobile();

  const show3D = ready && canRender3D && mode === "3d";

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Guided camera: scroll scrubs station focus, but only while idle in 3D so it
  // never fights a manual Run.
  const focusStage = useCallback(
    (index: number) => dispatch({ type: "SELECT_STAGE", index }),
    [dispatch],
  );
  useScrollGuide({
    targetRef: ref,
    count: PIPELINE_STAGES.length,
    enabled: !isMobile && show3D && !reducedMotion && state.phase === "idle",
    onIndex: focusStage,
  });

  const modeBar = (
    <ExperienceBar mode={mode} canRender3D={canRender3D} setMode={setMode} />
  );

  return (
    <div ref={ref}>
      {isMobile ? (
        <MobileWorkflow />
      ) : show3D ? (
        <World3DLayout
          modeBar={modeBar}
          viewport={<Viewport3D active={inView} tier={tier} />}
        />
      ) : (
        <Pipeline2D modeBar={modeBar} />
      )}
    </div>
  );
}
