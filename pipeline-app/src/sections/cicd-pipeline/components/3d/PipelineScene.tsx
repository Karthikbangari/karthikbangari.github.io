import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ConveyorBelt } from "./ConveyorBelt";
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
 * Isometric conveyor-factory scene (Valley OS warm tones). Orthographic camera
 * + flat iso angle; the artifact rides the belt through machine-stations.
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
      orthographic
      shadows={high}
      dpr={high ? [1, 1.75] : [1, 1.25]}
      gl={{ alpha: true, antialias: high, powerPreference: "high-performance" }}
      camera={{ position: [7, 9.5, 12], zoom: 40, near: 0.1, far: 200 }}
      frameloop={active ? "always" : "never"}
      style={{ background: "transparent" }}
    >
      {/* Warm soft daylight */}
      <hemisphereLight args={["#fbf7ec", "#cfe6d6", 1.0]} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.1}
        color="#fff3cf"
        castShadow={high}
        shadow-mapSize={[1024, 1024]}
      />
      <ambientLight intensity={0.35} />

      {/* Ground + blueprint grid (core gridHelper — no custom shader) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.47, 0]} receiveShadow>
        <planeGeometry args={[140, 70]} />
        <meshStandardMaterial color="#eef3f6" roughness={1} />
      </mesh>
      <gridHelper args={[120, 80, "#7ccb5b", "#cdd7df"]} position={[0, -0.45, 0]} />

      <ConveyorBelt
        cursorT={cursorT}
        active={active && phase === "running"}
        streamCount={high ? 40 : 22}
      />

      {/* Labels use troika text (font fetched async). Isolate that suspension so
          the belt + machines render immediately even if the font is slow. */}
      <Suspense fallback={null}>
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

      <ArtifactTravel targetT={cursorT} label={artifact} moving={phase === "running"} />
      </Suspense>

      <OrbitControls
        makeDefault
        target={[0, 0.4, 0]}
        enablePan={false}
        enableZoom
        minZoom={24}
        maxZoom={90}
        minPolarAngle={Math.PI * 0.12}
        maxPolarAngle={Math.PI * 0.46}
        minAzimuthAngle={-Math.PI * 0.4}
        maxAzimuthAngle={Math.PI * 0.4}
      />
      <CameraRig focusIndex={selectedIndex} />
    </Canvas>
  );
}
