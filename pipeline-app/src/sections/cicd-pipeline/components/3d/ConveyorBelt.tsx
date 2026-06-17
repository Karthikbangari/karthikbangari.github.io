import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BELT_LENGTH } from "./path";

const WIDTH = 2.4;
const TOP_Y = 0.0;
const ROLLERS = 28;

// Bright rainbow palette for the flowing data stream (the signature look).
const RAINBOW = [
  "#ff4d6d",
  "#ff9e3d",
  "#ffe14d",
  "#3ddc84",
  "#22d3ee",
  "#3b82f6",
  "#a855f7",
];

/**
 * Isometric conveyor belt with a BOLD rainbow data stream flowing continuously
 * along the top (always animating, even when idle) — three lanes of bright
 * instanced beads cycling through the rainbow. Plus a glossy belt + rollers.
 */
export function ConveyorBelt({
  active,
  streamCount = 90,
}: {
  active: boolean;
  streamCount?: number;
}) {
  const rollers = useRef<THREE.InstancedMesh>(null);
  const stream = useRef<THREE.InstancedMesh>(null);
  const frame = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);
  const x0 = -BELT_LENGTH / 2;

  const rollerGeo = useMemo(() => new THREE.CylinderGeometry(0.24, 0.24, WIDTH, 14), []);
  const beadGeo = useMemo(() => new THREE.SphereGeometry(1, 10, 10), []);
  useEffect(() => {
    return () => {
      rollerGeo.dispose();
      beadGeo.dispose();
    };
  }, [rollerGeo, beadGeo]);

  // Place rollers + bake bead colours once.
  useEffect(() => {
    const r = rollers.current;
    if (r) {
      for (let i = 0; i < ROLLERS; i += 1) {
        const x = x0 + (i / (ROLLERS - 1)) * BELT_LENGTH;
        dummy.position.set(x, TOP_Y - 0.2, 0);
        dummy.rotation.set(Math.PI / 2, 0, 0);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        r.setMatrixAt(i, dummy.matrix);
      }
      r.instanceMatrix.needsUpdate = true;
    }
    const s = stream.current;
    if (s) {
      for (let i = 0; i < streamCount; i += 1) {
        colorObj.set(RAINBOW[i % RAINBOW.length]);
        s.setColorAt(i, colorObj);
      }
      if (s.instanceColor) s.instanceColor.needsUpdate = true;
    }
  }, [dummy, colorObj, x0, streamCount]);

  useFrame((state) => {
    // Rebuild the bead matrices every other frame — half the CPU cost, still
    // reads as smooth flow.
    frame.current += 1;
    if (frame.current % 2 !== 0) return;
    const t = state.clock.elapsedTime;
    const s = stream.current;
    if (!s) return;
    const speed = active ? 0.14 : 0.05; // always flows, faster while running
    const lanes = 3;
    for (let i = 0; i < streamCount; i += 1) {
      const lane = (i % lanes) - 1;
      const base = (i / streamCount) * lanes; // stagger lanes
      const f = (base + t * speed) % 1;
      const x = x0 + f * BELT_LENGTH;
      const pulse = 0.085 + Math.sin(t * 6 + i) * 0.02;
      dummy.position.set(x, TOP_Y + 0.17 + Math.sin(t * 3 + i) * 0.015, lane * 0.62);
      dummy.scale.setScalar(pulse);
      dummy.updateMatrix();
      s.setMatrixAt(i, dummy.matrix);
    }
    s.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Belt frame */}
      <mesh position={[0, TOP_Y - 0.24, 0]} receiveShadow castShadow>
        <boxGeometry args={[BELT_LENGTH + 1, 0.4, WIDTH]} />
        <meshStandardMaterial color="#d7e3ec" roughness={0.45} metalness={0.45} />
      </mesh>
      {/* Glossy belt surface */}
      <mesh position={[0, TOP_Y, 0]} receiveShadow>
        <boxGeometry args={[BELT_LENGTH + 0.6, 0.07, WIDTH - 0.25]} />
        <meshStandardMaterial color="#fdfefe" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Side rails */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, TOP_Y + 0.06, side * (WIDTH / 2)]} castShadow>
          <boxGeometry args={[BELT_LENGTH + 0.8, 0.2, 0.13]} />
          <meshStandardMaterial color="#9fb6c4" roughness={0.4} metalness={0.55} />
        </mesh>
      ))}

      <instancedMesh ref={rollers} args={[rollerGeo, undefined, ROLLERS]}>
        <meshStandardMaterial color="#b9c8d2" roughness={0.35} metalness={0.6} />
      </instancedMesh>

      {/* Rainbow data stream — bright, unlit so it pops */}
      <instancedMesh ref={stream} args={[beadGeo, undefined, streamCount]}>
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
