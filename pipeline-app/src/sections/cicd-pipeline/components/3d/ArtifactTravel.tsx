import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import { pathCurve } from "./path";

/**
 * The glowing deployment artifact travelling stage-to-stage along the path.
 * `targetT` is the destination param (0..1); the artifact eases toward it so
 * movement is smooth even as the state machine jumps between stations.
 */
export function ArtifactTravel({
  targetT,
  label,
  moving,
}: {
  targetT: number;
  label: string;
  moving: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const tRef = useRef(0);
  const pos = useRef(new THREE.Vector3());

  useFrame((state) => {
    tRef.current = THREE.MathUtils.lerp(tRef.current, targetT, 0.05);
    pathCurve.getPoint(THREE.MathUtils.clamp(tRef.current, 0, 1), pos.current);
    const g = group.current;
    if (!g) return;
    const bob = Math.sin(state.clock.elapsedTime * 2) * 0.08;
    g.position.set(pos.current.x, pos.current.y + 0.65 + bob, pos.current.z);
    g.rotation.y += 0.03;
    if (halo.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * (moving ? 0.18 : 0.06);
      halo.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial
          color="#fff4cf"
          emissive="#f5d76e"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshBasicMaterial color="#f5e6a0" transparent opacity={0.22} />
      </mesh>
      <pointLight color="#ffe9a8" intensity={1.4} distance={3} />
      <Billboard position={[0, 0.7, 0]}>
        <Text
          fontSize={0.22}
          color="#0f172a"
          anchorX="center"
          outlineWidth={0.01}
          outlineColor="#ffffff"
        >
          {label}
        </Text>
      </Billboard>
    </group>
  );
}
