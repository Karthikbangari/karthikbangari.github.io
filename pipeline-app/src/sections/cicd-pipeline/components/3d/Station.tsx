import { useRef, useState, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { PipelineStage, StageStatus } from "../../types";
import { STATUS_COLOR, type StationVisual } from "./stations3d";

interface Props {
  stage: PipelineStage;
  index: number;
  position: THREE.Vector3;
  visual: StationVisual;
  status: StageStatus;
  selected: boolean;
  onSelect: (index: number) => void;
}

const WALL = "#f4efe6";

export function Station({
  stage,
  index,
  position,
  visual,
  status,
  selected,
  onSelect,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const running = status === "running";
  const glow = STATUS_COLOR[status];

  const ringMat = useRef<THREE.MeshStandardMaterial>(null);
  const gear = useRef<THREE.Group>(null);
  const lanes = useRef<THREE.Group>(null);
  const layers = useRef<THREE.Group>(null);
  const pillars = useRef<THREE.Group>(null);
  const pods = useRef<THREE.Group>(null);
  const scanner = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringMat.current) {
      const base = running ? 0.9 : status === "success" ? 0.5 : 0.22;
      ringMat.current.emissiveIntensity = base + Math.sin(t * 3) * (running ? 0.4 : 0.1);
    }
    if (gear.current) gear.current.rotation.z += running ? 0.07 : 0.015;
    if (lanes.current && running) {
      lanes.current.children.forEach((lane, i) => {
        const m = (lane as THREE.Mesh).material as THREE.MeshStandardMaterial;
        m.emissiveIntensity = 0.2 + ((Math.sin(t * 4 - i * 1.1) + 1) / 2) * 1.1;
      });
    }
    if (layers.current) {
      layers.current.children.forEach((layer, i) => {
        const target = 0.14 + i * 0.18;
        const rise = running ? target * ((Math.sin(t * 1.6 - i) + 1) / 2) : target;
        layer.position.y = THREE.MathUtils.lerp(layer.position.y, rise, 0.1);
      });
    }
    if (pillars.current) {
      pillars.current.children.forEach((p, i) => {
        const target = running ? 0.2 + ((i % 3) + 1) * 0.18 : status === "success" ? 0.3 : 0.05;
        p.scale.y = THREE.MathUtils.lerp(p.scale.y, target, 0.08);
      });
    }
    if (pods.current && (running || status === "success")) {
      pods.current.children.forEach((pod, i) => {
        const flip = running ? Math.sin(t * 2.2 - i * 0.8) * 0.5 : Math.PI;
        pod.rotation.x = THREE.MathUtils.lerp(pod.rotation.x, flip, 0.06);
      });
    }
    if (scanner.current) scanner.current.rotation.y += running ? 0.06 : 0.02;
  });

  const labelW = Math.max(2.1, stage.title.length * 0.17 + 0.7);

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      scale={hovered ? 1.04 : 1}
    >
      {/* Machine pedestal on the belt */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.22, 1.5]} />
        <meshStandardMaterial color="#c7d2da" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Status ring set into the pedestal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.31, 0]}>
        <torusGeometry args={[0.82, 0.05, 12, 36]} />
        <meshStandardMaterial
          ref={ringMat}
          color={glow}
          emissive={glow}
          emissiveIntensity={0.4}
          roughness={0.5}
        />
      </mesh>

      <Machine
        kind={visual.kind}
        accent={visual.accent}
        glow={glow}
        refs={{ gear, lanes, layers, pillars, pods, scanner }}
      />

      {/* Dark rounded callout label */}
      <Billboard position={[0, 2.7, 0]}>
        <RoundedBox args={[labelW, 0.66, 0.08]} radius={0.14} smoothness={4}>
          <meshBasicMaterial color={selected ? "#16324a" : "#0f1d2c"} />
        </RoundedBox>
        <Text position={[0, 0.1, 0.06]} fontSize={0.26} color="#ffffff" anchorX="center" anchorY="middle">
          {`${index + 1}. ${stage.title}`}
        </Text>
        <Text position={[0, -0.16, 0.06]} fontSize={0.15} color="#9fd0ff" anchorX="center" anchorY="middle">
          {stage.tool}
        </Text>
      </Billboard>
    </group>
  );
}

interface MachineRefs {
  gear: React.RefObject<THREE.Group>;
  lanes: React.RefObject<THREE.Group>;
  layers: React.RefObject<THREE.Group>;
  pillars: React.RefObject<THREE.Group>;
  pods: React.RefObject<THREE.Group>;
  scanner: React.RefObject<THREE.Group>;
}

function Machine({
  kind,
  accent,
  glow,
  refs,
}: {
  kind: StationVisual["kind"];
  accent: string;
  glow: string;
  refs: MachineRefs;
}): ReactNode {
  switch (kind) {
    case "cabin": // Source — database stack + monitor
      return (
        <group position={[0, 0.35, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[-0.3, 0.18 + i * 0.26, 0]} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.22, 18]} />
              <meshStandardMaterial color={accent} roughness={0.4} metalness={0.2} />
            </mesh>
          ))}
          <mesh position={[0.5, 0.4, 0]} castShadow>
            <boxGeometry args={[0.5, 0.4, 0.08]} />
            <meshStandardMaterial color="#16324a" emissive={accent} emissiveIntensity={0.4} />
          </mesh>
        </group>
      );

    case "mill": // Build — machine box with gear
      return (
        <group position={[0, 0.4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.7, 0.8]} />
            <meshStandardMaterial color={WALL} roughness={0.7} />
          </mesh>
          <group ref={refs.gear} position={[0, 0.55, 0]}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]} position={[0, 0.28, 0]}>
                <boxGeometry args={[0.12, 0.5, 0.12]} />
                <meshStandardMaterial color={accent} metalness={0.4} roughness={0.4} />
              </mesh>
            ))}
            <mesh>
              <cylinderGeometry args={[0.2, 0.2, 0.18, 16]} />
              <meshStandardMaterial color={accent} />
            </mesh>
          </group>
        </group>
      );

    case "gate": // Quality & Security — scanner arch + beam
      return (
        <group position={[0, 0.4, 0]}>
          {[-0.45, 0.45].map((x) => (
            <mesh key={x} position={[x, 0.1, 0]} castShadow>
              <boxGeometry args={[0.16, 1, 0.16]} />
              <meshStandardMaterial color={WALL} roughness={0.7} />
            </mesh>
          ))}
          <mesh position={[0, 0.62, 0]}>
            <boxGeometry args={[1.1, 0.16, 0.16]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          <group ref={refs.scanner}>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.9, 0.04, 0.2]} />
              <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.9} />
            </mesh>
          </group>
        </group>
      );

    case "barn": // Package & Registry — stacked container layers
      return (
        <group position={[0, 0.35, 0]} ref={refs.layers}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, 0.14, 0]} castShadow>
              <boxGeometry args={[0.8 - i * 0.14, 0.16, 0.7 - i * 0.12]} />
              <meshStandardMaterial color={i % 2 ? "#cfe6ff" : accent} metalness={0.2} roughness={0.5} />
            </mesh>
          ))}
        </group>
      );

    case "field": // Infrastructure — server rack pillars rising
      return (
        <group position={[0, 0.3, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <planeGeometry args={[1.4, 1.1]} />
            <meshStandardMaterial color="#1e3a5f" emissive={accent} emissiveIntensity={0.15} />
          </mesh>
          <group ref={refs.pillars}>
            {Array.from({ length: 6 }).map((_, i) => (
              <mesh key={i} position={[((i % 3) - 1) * 0.4, 0.3, i < 3 ? -0.25 : 0.25]} scale={[1, 0.05, 1]}>
                <boxGeometry args={[0.22, 1.1, 0.22]} />
                <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.3} metalness={0.3} />
              </mesh>
            ))}
          </group>
        </group>
      );

    case "pods": // Deploy / EKS — factory building + flipping pods
      return (
        <group position={[0, 0.4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1, 0.7, 0.85]} />
            <meshStandardMaterial color={WALL} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[0.7, 0.4, 4]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          <group ref={refs.pods} position={[0, -0.05, 0.5]}>
            {Array.from({ length: 4 }).map((_, i) => (
              <mesh key={i} position={[((i % 2) - 0.5) * 0.5, 0, (i < 2 ? -0.12 : 0.12)]}>
                <boxGeometry args={[0.22, 0.22, 0.22]} />
                <meshStandardMaterial color={accent} emissive={glow} emissiveIntensity={0.3} />
              </mesh>
            ))}
          </group>
        </group>
      );

    case "crossroads": // Release — track fork / switch
      return (
        <group position={[0, 0.4, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
            <meshStandardMaterial color="#aebcc6" metalness={0.4} />
          </mesh>
          {[-0.4, 0.4].map((z, i) => (
            <mesh key={i} position={[0.3, 0.3, z]} rotation={[0, 0, -0.4]}>
              <boxGeometry args={[0.7, 0.1, 0.1]} />
              <meshStandardMaterial color={accent} emissive={glow} emissiveIntensity={0.3} />
            </mesh>
          ))}
          <mesh position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.7} />
          </mesh>
        </group>
      );

    case "watchtower": // Observability — dashboard screen
      return (
        <group position={[0, 0.45, 0]}>
          <mesh position={[0, -0.1, 0]} castShadow>
            <boxGeometry args={[0.18, 0.5, 0.18]} />
            <meshStandardMaterial color="#aebcc6" metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[1, 0.7, 0.08]} />
            <meshStandardMaterial color="#16324a" />
          </mesh>
          <group ref={refs.scanner}>
            <mesh position={[0, 0.35, 0.06]}>
              <planeGeometry args={[0.8, 0.5]} />
              <meshBasicMaterial color={glow} toneMapped={false} transparent opacity={0.7} />
            </mesh>
          </group>
        </group>
      );
  }
}
