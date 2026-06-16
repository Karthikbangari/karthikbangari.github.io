import { Pipeline2D } from "./Pipeline2D";
import { ExperienceBar } from "./components/ExperienceBar";
import { Viewport3D } from "./components/Viewport3D";
import { useRenderMode } from "./hooks/useRenderMode";
import { useInView } from "./hooks/useInView";

/**
 * Chooses the render mode (3D on capable devices, otherwise the first-class 2D
 * fallback) and pauses the 3D render loop when the section is off-screen. Both
 * modes share the exact same controls, panels, and state machine.
 */
export function PipelineExperience() {
  const { mode, capable, tier, ready, setMode } = useRenderMode();
  const { ref, inView } = useInView<HTMLDivElement>();

  const show3D = ready && capable && mode === "3d";

  return (
    <div ref={ref}>
      <Pipeline2D
        modeBar={
          <ExperienceBar mode={mode} capable={capable} setMode={setMode} />
        }
        viewport={
        show3D ? (
          <Viewport3D
            active={inView}
            tier={tier}
            onSceneError={() => setMode("2d")}
          />
        ) : undefined
      }
      />
    </div>
  );
}
