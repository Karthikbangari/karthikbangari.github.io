import { useRef, useState, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
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

  // Refs for per-station signature animations.
  const ringRef = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshStandardMaterial>(null);
  const millBlades = useRef<THREE.Group>(null);
  const lanes = useRef<THREE.Group>(null);
  const layers = useRef<THREE.Group>(null);
  const pillars = useRef<THREE.Group>(null);
  const pods = useRef<THREE.Group>(null);
  const scanner = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Status ring: gentle pulse, stronger while running.
    if (ringMat.current) {
      const base = running ? 0.9 : status === "success" ? 0.5 : 0.25;
      ringMat.current.emissiveIntensity = base + Math.sin(t * 3) * (running ? 0.4 : 0.12);
    }
    if (ringRef.current) {
      const s = selected ? 1.12 : 1;
      ringRef.current.scale.setScalar(s + (running ? Math.sin(t * 3) * 0.03 : 0));
    }

    // Signature motion only matters while running.
    if (millBlades.current) millBlades.current.rotation.z += running ? 0.06 : 0.012;

    if (lanes.current && running) {
      lanes.current.children.forEach((lane, i) => {
        const mat = ((lane as THREE.Mesh).material as THREE.MeshStandardMaterial);
        const phase = (Math.sin(t * 4 - i * 1.1) + 1) / 2;
        mat.emissiveIntensity = 0.2 + phase * 1.1;
      });
    }
    if (layers.current) {
      // Docker layers assemble upward, then settle when not running.
      layers.current.children.forEach((layer, i) => {
        const target = 0.12 + i * 0.16;
        const rise = running ? target * ((Math.sin(t * 1.6 - i) + 1) / 2) : target;
        layer.position.y = THREE.MathUtils.lerp(layer.position.y, rise, 0.1);
      });
    }
    if (pillars.current) {
      pillars.current.children.forEach((p, i) => {
        const target = running ? 0.2 + ((i % 3) + 1) * 0.18 : status === "success" ? 0.3 : 0.04;
        p.scale.y = THREE.MathUtils.lerp(p.scale.y, target, 0.08);
      });
    }
    if (pods.current && (running || status === "success")) {
      pods.current.children.forEach((pod, i) => {
        const flip = running ? Math.sin(t * 2.2 - i * 0.8) * 0.5 : Math.PI;
        pod.rotation.x = THREE.MathUtils.lerp(pod.rotation.x, flip, 0.06);
      });
    }
    if (scanner.current) scanner.current.rotation.y += running ? 0.05 : 0.02;
  });

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
      {/* Grass platform */}
      <mesh receiveShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.95, 1.05, 0.18, 20]} />
        <meshStandardMaterial color="#a8dc8a" roughness={1} />
      </mesh>

      {/* Status ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.16, 0]}>
        <torusGeometry args={[0.9, 0.05, 12, 36]} />
        <meshStandardMaterial
          ref={ringMat}
          color={glow}
          emissive={glow}
          emissiveIntensity={0.4}
          roughness={0.5}
        />
      </mesh>

      <Structure
        visual={visual}
        glow={glow}
        running={running}
        refs={{ millBlades, lanes, layers, pillars, pods, scanner }}
      />

      {/* Floating label */}
      <Billboard position={[0, 2.5, 0]}>
        <Text
          fontSize={0.34}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#ffffff"
        >
          {`${index + 1}. ${stage.title}`}
        </Text>
        <Text position={[0, -0.34, 0]} fontSize={0.2} color="#2563eb" anchorX="center">
          {stage.tool}
        </Text>
      </Billboard>
    </group>
  );
}

interface StructureRefs {
  millBlades: React.RefObject<THREE.Group>;
  lanes: React.RefObject<THREE.Group>;
  layers: React.RefObject<THREE.Group>;
  pillars: React.RefObject<THREE.Group>;
  pods: React.RefObject<THREE.Group>;
  scanner: React.RefObject<THREE.Group>;
}

function Structure({
  visual,
  glow,
  refs,
}: {
  visual: StationVisual;
  glow: string;
  running: boolean;
  refs: StructureRefs;
}): ReactNode {
  const { accent, kind } = visual;
  const wall = "#f4efe6";

  switch (kind) {
    case "cabin":
      return (
        <group position={[0, 0.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.7, 0.8]} />
            <meshStandardMaterial color={wall} roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, 0.55, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[0.78, 0.5, 4]} />
            <meshStandardMaterial color={accent} roughness={0.8} />
          </mesh>
        </group>
      );

    case "mill":
      return (
        <group position={[0, 0.5, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.34, 0.46, 1.1, 12]} />
            <meshStandardMaterial color={wall} roughness={0.9} />
          </mesh>
          <group ref={refs.millBlades} position={[0, 0.55, 0.4]}>
            {[0, 1, 2, 3].map((i) => (
              <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]} position={[0, 0.4, 0]}>
                <boxGeometry args={[0.1, 0.8, 0.04]} />
                <meshStandardMaterial color={accent} />
              </mesh>
            ))}
          </group>
          {/* Build lanes that illuminate sequentially */}
          <group ref={refs.lanes} position={[0, -0.1, 0.47]}>
            {[0, 1, 2].map((i) => (
              <mesh key={i} position={[(i - 1) * 0.22, 0, 0]}>
                <boxGeometry args={[0.16, 0.5, 0.04]} />
                <meshStandardMaterial color="#16324a" emissive={glow} emissiveIntensity={0.2} />
              </mesh>
            ))}
          </group>
        </group>
      );

    case "gate":
      return (
        <group position={[0, 0.5, 0]}>
          {[-0.4, 0.4].map((x) => (
            <mesh key={x} castShadow position={[x, 0, 0]}>
              <boxGeometry args={[0.16, 1.1, 0.16]} />
              <meshStandardMaterial color={wall} roughness={0.9} />
            </mesh>
          ))}
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[1.1, 0.18, 0.18]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <octahedronGeometry args={[0.26, 0]} />
            <meshStandardMaterial color={accent} emissive={glow} emissiveIntensity={0.6} />
          </mesh>
        </group>
      );

    case "barn":
      return (
        <group position={[0, 0.3, 0]}>
          <mesh castShadow position={[0, 0.35, 0]}>
            <boxGeometry args={[1, 0.7, 0.8]} />
            <meshStandardMaterial color={accent} roughness={0.85} />
          </mesh>
          {/* Container layers assembling */}
          <group ref={refs.layers}>
            {[0, 1, 2].map((i) => (
              <mesh key={i} position={[0, 0.1, 0]}>
                <boxGeometry args={[0.7 - i * 0.12, 0.14, 0.6 - i * 0.1]} />
                <meshStandardMaterial color={i % 2 ? "#cfe6ff" : "#9fd0ff"} />
              </mesh>
            ))}
          </group>
        </group>
      );

    case "field":
      return (
        <group position={[0, 0.2, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <planeGeometry args={[1.5, 1.2]} />
            <meshStandardMaterial color="#1e3a5f" emissive={accent} emissiveIntensity={0.18} />
          </mesh>
          {/* Resources rising from the blueprint */}
          <group ref={refs.pillars}>
            {Array.from({ length: 6 }).map((_, i) => (
              <mesh
                key={i}
                position={[((i % 3) - 1) * 0.4, 0.25, i < 3 ? -0.25 : 0.25]}
                scale={[1, 0.04, 1]}
              >
                <boxGeometry args={[0.22, 1, 0.22]} />
                <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.3} />
              </mesh>
            ))}
          </group>
        </group>
      );

    case "pods":
      return (
        <group position={[0, 0.45, 0]}>
          {/* EKS pods flipping old → new */}
          <group ref={refs.pods}>
            {Array.from({ length: 4 }).map((_, i) => (
              <mesh key={i} position={[((i % 2) - 0.5) * 0.5, 0, (i < 2 ? -0.3 : 0.3)]}>
                <boxGeometry args={[0.34, 0.34, 0.34]} />
                <meshStandardMaterial color={accent} emissive={glow} emissiveIntensity={0.3} />
              </mesh>
            ))}
          </group>
        </group>
      );

    case "crossroads":
      return (
        <group position={[0, 0.5, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.07, 1.1, 8]} />
            <meshStandardMaterial color="#caa873" />
          </mesh>
          {[0.25, 0, -0.25].map((y, i) => (
            <mesh key={i} position={[i % 2 ? 0.35 : -0.35, y + 0.2, 0]}>
              <boxGeometry args={[0.6, 0.16, 0.06]} />
              <meshStandardMaterial color={accent} emissive={glow} emissiveIntensity={0.25} />
            </mesh>
          ))}
        </group>
      );

    case "watchtower":
      return (
        <group position={[0, 0.5, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.42, 1.2, 10]} />
            <meshStandardMaterial color={wall} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.12, 10]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          <group ref={refs.scanner} position={[0, 0.78, 0]}>
            <mesh position={[0.4, 0, 0]}>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={1.1} />
            </mesh>
          </group>
        </group>
      );
  }
}
