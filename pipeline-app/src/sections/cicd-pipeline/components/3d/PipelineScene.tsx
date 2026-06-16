import { Canvas } from "@react-three/fiber";
import { ValleyAmbience } from "./ValleyAmbience";
import { MeadowPath } from "./MeadowPath";
import { Station } from "./Station";
import { ArtifactTravel } from "./ArtifactTravel";
import { CameraRig } from "./CameraRig";
import { ReleaseStrategyViz } from "./ReleaseStrategyViz";
import { DeployRollbackViz } from "./DeployRollbackViz";
import { stationPositions } from "./path";
import { STATION_VISUALS } from "./stations3d";
import { PIPELINE_STAGES } from "../../pipelineConfig";
import type { DeployStrategy, Phase, StageStatus } from "../../types";
import type { QualityTier } from "../../hooks/useRenderMode";

export interface SceneProps {
  /** When false (section off-screen), rendering is paused to save battery. */
  active: boolean;
  statuses: StageStatus[];
  activeIndex: number;
  selectedIndex: number;
  phase: Phase;
  strategy: DeployStrategy;
  rolledBack: boolean;
  artifact: string;
  tier: QualityTier;
  onSelect: (index: number) => void;
}

const DEPLOY_INDEX = PIPELINE_STAGES.findIndex((s) => s.id === "deploy-eks");
const RELEASE_INDEX = PIPELINE_STAGES.findIndex((s) => s.id === "release-strategy");

/**
 * Default-exported for React.lazy() — three.js + R3F live in a separate chunk.
 * State arrives as props (bridged from the provider by Viewport3D) since the
 * Canvas is a separate reconciler.
 */
export default function PipelineScene({
  active,
  statuses,
  activeIndex,
  selectedIndex,
  phase,
  strategy,
  rolledBack,
  artifact,
  tier,
  onSelect,
}: SceneProps) {
  const n = PIPELINE_STAGES.length;
  const lastSuccess = statuses.lastIndexOf("success");
  const cursorIndex =
    phase === "completed" ? n - 1 : Math.max(activeIndex, lastSuccess, 0);
  const cursorT = cursorIndex / (n - 1);

  const high = tier === "high";

  return (
    <Canvas
      shadows={high}
      dpr={high ? [1, 1.75] : [1, 1.25]}
      gl={{ alpha: true, antialias: high, powerPreference: "high-performance" }}
      camera={{ position: [0, 2.2, 12], fov: 44 }}
      frameloop={active ? "always" : "never"}
      style={{ background: "transparent" }}
    >
      <hemisphereLight args={["#eaf6ff", "#bfe7a8", 0.95]} />
      <directionalLight
        position={[-6.5, 7, 4]}
        intensity={1.15}
        color="#fff3cf"
        castShadow={high}
        shadow-mapSize={[1024, 1024]}
      />
      <ambientLight intensity={0.25} />

      <ValleyAmbience />
      <MeadowPath
        cursorT={cursorT}
        active={active && phase === "running"}
        count={high ? 48 : 24}
      />

      {PIPELINE_STAGES.map((stage, i) => (
        <Station
          key={stage.id}
          stage={stage}
          index={i}
          position={stationPositions[i]}
          visual={STATION_VISUALS[stage.id]}
          status={statuses[i]}
          selected={selectedIndex === i}
          onSelect={onSelect}
        />
      ))}

      <DeployRollbackViz
        position={stationPositions[DEPLOY_INDEX]}
        deployStatus={statuses[DEPLOY_INDEX]}
        phase={phase}
        rolledBack={rolledBack}
      />
      <ReleaseStrategyViz
        position={stationPositions[RELEASE_INDEX]}
        strategy={strategy}
        active={statuses[RELEASE_INDEX] === "running"}
        done={statuses[RELEASE_INDEX] === "success"}
        rolledBack={rolledBack}
      />

      <ArtifactTravel
        targetT={cursorT}
        label={artifact}
        moving={phase === "running"}
      />

      <CameraRig focusIndex={selectedIndex} />
    </Canvas>
  );
}
