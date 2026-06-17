import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { BELT_LENGTH } from "./path";

const START = new THREE.Vector3(BELT_LENGTH / 2 + 0.4, 0, 0);
const PROD = new THREE.Vector3(BELT_LENGTH / 2 + 5, 0, 3.4);
const STAGE = new THREE.Vector3(BELT_LENGTH / 2 + 5, 0, -3.4);
const RAINBOW = ["#ff4d6d", "#ffe14d", "#3ddc84", "#22d3ee", "#a855f7"];

/** A diverging belt branch with flowing rainbow beads. */
function Branch({ to }: { to: THREE.Vector3 }) {
  const beads = useRef<THREE.Group>(null);
  const dir = useMemo(() => to.clone().sub(START), [to]);
  const len = dir.length();
  const angle = Math.atan2(dir.z, dir.x);
  const mid = useMemo(() => START.clone().add(to).multiplyScalar(0.5), [to]);

  useFrame((state) => {
    const g = beads.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((b, i) => {
      const f = ((i / g.children.length + t * 0.12) % 1);
      b.position.lerpVectors(START, to, f);
      b.position.y = 0.16 + Math.sin(t * 4 + i) * 0.02;
    });
  });

  return (
    <group>
      {/* branch belt */}
      <mesh position={[mid.x, -0.02, mid.z]} rotation={[0, -angle, 0]} receiveShadow castShadow>
        <boxGeometry args={[len, 0.12, 1.6]} />
        <meshStandardMaterial color="#dbe6ee" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* flowing beads */}
      <group ref={beads}>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshBasicMaterial color={RAINBOW[i % RAINBOW.length]} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** End-of-line fork: belt splits to Staging and Production (with a rocket). */
export function ForkEnd() {
  const rocket = useRef<THREE.Group>(null);
  const flame = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (rocket.current) rocket.current.position.y = 0.6 + Math.sin(t * 1.5) * 0.08;
    if (flame.current) {
      const s = 0.8 + Math.sin(t * 18) * 0.25;
      flame.current.scale.set(1, s, 1);
    }
  });

  return (
    <group>
      {/* junction node */}
      <mesh position={[START.x, 0, 0]} castShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.28, 24]} />
        <meshStandardMaterial color="#c7d2da" roughness={0.5} metalness={0.3} />
      </mesh>

      <Branch to={STAGE} />
      <Branch to={PROD} />

      {/* Staging building */}
      <group position={[STAGE.x, 0, STAGE.z]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.1, 0.9, 1.1]} />
          <meshStandardMaterial color="#9fd0ff" roughness={0.6} />
        </mesh>
        <Billboard position={[0, 1.7, 0]}>
          <RoundedBox args={[1.7, 0.55, 0.08]} radius={0.12}>
            <meshBasicMaterial color="#0f1d2c" />
          </RoundedBox>
          <Text position={[0, 0, 0.06]} fontSize={0.24} color="#9fd0ff" anchorX="center" anchorY="middle">
            STAGING
          </Text>
        </Billboard>
      </group>

      {/* Production pad + rocket */}
      <group position={[PROD.x, 0, PROD.z]}>
        <mesh position={[0, 0.12, 0]} receiveShadow>
          <cylinderGeometry args={[0.9, 1, 0.24, 24]} />
          <meshStandardMaterial color="#2b1840" roughness={0.6} />
        </mesh>
        <group ref={rocket}>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.28, 0.9, 16]} />
            <meshStandardMaterial color="#f4efe6" metalness={0.2} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.62, 0]}>
            <coneGeometry args={[0.22, 0.4, 16]} />
            <meshStandardMaterial color="#ff4d6d" emissive="#ff4d6d" emissiveIntensity={0.4} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.24, -0.42, 0]} rotation={[0, 0, s * -0.5]}>
              <boxGeometry args={[0.14, 0.28, 0.04]} />
              <meshStandardMaterial color="#a855f7" />
            </mesh>
          ))}
          <mesh ref={flame} position={[0, -0.62, 0]}>
            <coneGeometry args={[0.16, 0.5, 12]} />
            <meshBasicMaterial color="#ffb43d" toneMapped={false} />
          </mesh>
        </group>
        <Billboard position={[0, 2.1, 0]}>
          <RoundedBox args={[2, 0.6, 0.08]} radius={0.13}>
            <meshBasicMaterial color="#0f1d2c" />
          </RoundedBox>
          <Text position={[0, 0, 0.06]} fontSize={0.26} color="#3ddc84" anchorX="center" anchorY="middle">
            PRODUCTION
          </Text>
        </Billboard>
      </group>
    </group>
  );
}
