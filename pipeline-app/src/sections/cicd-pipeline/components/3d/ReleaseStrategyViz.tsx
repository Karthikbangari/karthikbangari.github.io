import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import type { DeployStrategy } from "../../types";

interface Props {
  position: THREE.Vector3;
  strategy: DeployStrategy;
  /** Release stage is actively progressing. */
  active: boolean;
  /** Release completed successfully. */
  done: boolean;
  rolledBack: boolean;
}

const LABEL: Record<DeployStrategy, string> = {
  rolling: "Rolling",
  canary: "Canary",
  "blue-green": "Blue-Green",
};

// Next-version traffic checkpoints (%), stepped through while active.
const STEPS: Record<DeployStrategy, number[]> = {
  canary: [10, 25, 50, 100], // DEMO DATA — replace with real project metrics
  "blue-green": [0, 100],
  rolling: [25, 50, 75, 100],
};

const WIDTH = 2.2;

/**
 * Floating release panel above the crossroads. Visualises the live traffic
 * split for the chosen strategy, gated by a passing health check. On rollback
 * the split snaps back to the stable version. Steps advance on a timer
 * (discrete, React-friendly); the bars ease in useFrame.
 */
export function ReleaseStrategyViz({
  position,
  strategy,
  active,
  done,
  rolledBack,
}: Props) {
  const steps = STEPS[strategy];
  const [step, setStep] = useState(0);

  // Advance traffic steps while the release stage runs.
  useEffect(() => {
    if (rolledBack) {
      setStep(0);
      return;
    }
    if (done) {
      setStep(steps.length - 1);
      return;
    }
    if (!active) {
      setStep(0);
      return;
    }
    setStep(0);
    const id = window.setInterval(() => {
      setStep((s) => Math.min(s + 1, steps.length - 1));
    }, 850);
    return () => window.clearInterval(id);
  }, [active, done, rolledBack, strategy, steps.length]);

  const nextFrac = rolledBack ? 0 : steps[step] / 100;
  const stableFrac = 1 - nextFrac;

  const stableBar = useRef<THREE.Mesh>(null);
  const nextBar = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const apply = (
      mesh: THREE.Mesh | null,
      frac: number,
      side: 1 | -1,
    ) => {
      if (!mesh) return;
      const target = Math.max(0.0001, frac);
      mesh.scale.x = THREE.MathUtils.lerp(mesh.scale.x, target, 0.12);
      mesh.position.x = side * (WIDTH / 2 - (mesh.scale.x * WIDTH) / 2);
      mesh.visible = frac > 0.001;
    };
    apply(nextBar.current, nextFrac, -1);
    apply(stableBar.current, stableFrac, 1);
  });

  const gateColor = rolledBack
    ? "#e08a8a"
    : done
      ? "#10b981"
      : active
        ? "#2563eb"
        : "#94a3b8";
  const gateText = rolledBack
    ? "rollback → 100% stable"
    : done
      ? "health PASS · promoted"
      : active
        ? `analysing… next ${Math.round(nextFrac * 100)}%`
        : "idle";

  return (
    <group position={[position.x, position.y + 2.95, position.z]}>
      <Billboard>
        <Text
          fontSize={0.22}
          color="#0f172a"
          anchorX="center"
          outlineWidth={0.01}
          outlineColor="#ffffff"
          position={[0, 0.42, 0]}
        >
          {`${LABEL[strategy]} · next ${Math.round(nextFrac * 100)}%`}
        </Text>

        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[WIDTH + 0.1, 0.34]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.12} />
        </mesh>
        <mesh ref={stableBar} position={[0, 0, 0]}>
          <planeGeometry args={[WIDTH, 0.28]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.9} />
        </mesh>
        <mesh ref={nextBar} position={[0, 0, 0.001]}>
          <planeGeometry args={[WIDTH, 0.28]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>

        <mesh position={[-1.0, -0.4, 0]}>
          <circleGeometry args={[0.08, 16]} />
          <meshBasicMaterial color={gateColor} />
        </mesh>
        <Text
          position={[-0.86, -0.4, 0]}
          fontSize={0.15}
          color={gateColor}
          anchorX="left"
        >
          {gateText}
        </Text>
      </Billboard>
    </group>
  );
}
