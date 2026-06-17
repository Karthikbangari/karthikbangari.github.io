import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import type { Phase, StageStatus } from "../../types";

interface Props {
  position: THREE.Vector3;
  deployStatus: StageStatus;
  phase: Phase;
  rolledBack: boolean;
}

const HEALTHY = "#10b981";
const UNHEALTHY = "#e08a8a";
const BASE_ERR = 0.08; // DEMO DATA — replace with real project metrics
const PEAK_ERR = 5.4; // DEMO DATA — replace with real project metrics

/**
 * Health overlay above the EKS pod field. Tells the rollback story:
 * error-rate climbs → pods go unhealthy → Prometheus alert → automatic
 * rollback → traffic returns to stable → healthy previous-version pods return.
 */
export function DeployRollbackViz({
  position,
  deployStatus,
  phase,
  rolledBack,
}: Props) {
  const rollingBack = phase === "rollingBack";
  const failed = deployStatus === "failed" || rollingBack;

  const dots = useRef<THREE.Group>(null);
  const errRef = useRef(BASE_ERR);
  const errText = useRef<{ v: string }>({ v: "" });
  const alertRef = useRef<THREE.Group>(null);
  const [errTextState, setErrTextState] = useThrottledText();

  const dotGeo = useMemo(() => new THREE.SphereGeometry(0.1, 12, 12), []);
  useEffect(() => () => dotGeo.dispose(), [dotGeo]);

  useFrame((state, dt) => {
    // Error-rate climbs while unhealthy, recovers after rollback.
    const target = rollingBack ? PEAK_ERR : BASE_ERR;
    errRef.current = THREE.MathUtils.lerp(errRef.current, target, dt * 1.8);
    const shown = errRef.current.toFixed(2);
    if (shown !== errText.current.v) {
      errText.current.v = shown;
      setErrTextState(`${shown}%`);
    }

    // Pulse the alert badge while rolling back.
    if (alertRef.current) {
      alertRef.current.visible = rollingBack;
      const s = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.12;
      alertRef.current.scale.setScalar(rollingBack ? s : 1);
    }

    // Pod health dots: red while failing, jitter; green when healthy/restored.
    if (dots.current) {
      dots.current.children.forEach((dot, i) => {
        const mesh = dot as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        const bad = failed && !rolledBack;
        mat.color.set(bad ? UNHEALTHY : HEALTHY);
        mesh.position.y = bad ? Math.sin(state.clock.elapsedTime * 12 + i) * 0.04 : 0;
      });
    }
  });

  const statusLabel = rolledBack
    ? "previous stable restored"
    : rollingBack
      ? "ALERT · rolling back"
      : deployStatus === "success"
        ? "4/4 pods healthy"
        : deployStatus === "running"
          ? "rolling out…"
          : "awaiting deploy";
  const tone = rolledBack ? HEALTHY : failed ? UNHEALTHY : HEALTHY;

  return (
    <group position={[position.x, position.y + 1.9, position.z]}>
      <Billboard>
        <group ref={dots} position={[0, 0.35, 0]}>
          {[-0.45, -0.15, 0.15, 0.45].map((x, i) => (
            <mesh key={i} geometry={dotGeo} position={[x, 0, 0]}>
              <meshBasicMaterial color={HEALTHY} />
            </mesh>
          ))}
        </group>

        <Text fontSize={0.18} color={tone} anchorX="center" position={[0, 0, 0]}>
          {`err ${errTextState}`}
        </Text>
        <Text
          fontSize={0.15}
          color={tone}
          anchorX="center"
          position={[0, -0.26, 0]}
          outlineWidth={0.008}
          outlineColor="#ffffff"
        >
          {statusLabel}
        </Text>

        <group ref={alertRef} position={[0, 0.72, 0]} visible={false}>
          <mesh>
            <circleGeometry args={[0.16, 3]} />
            <meshBasicMaterial color="#e0a23a" />
          </mesh>
          <Text fontSize={0.14} color="#7a5b00" anchorX="center" position={[0, 0.34, 0]}>
            Prometheus alert
          </Text>
        </group>
      </Billboard>
    </group>
  );
}

// Tiny helper: throttle frequent text updates to React state at a low rate.
function useThrottledText(): [string, (v: string) => void] {
  const [text, setText] = useState("0.08%");
  const pending = useRef<string | null>(null);
  useEffect(() => {
    const id = window.setInterval(() => {
      if (pending.current !== null) {
        setText(pending.current);
        pending.current = null;
      }
    }, 450);
    return () => window.clearInterval(id);
  }, []);
  return [text, (v: string) => (pending.current = v)];
}
