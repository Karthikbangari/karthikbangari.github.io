import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BELT_LENGTH } from "./path";

const WIDTH = 2.2;
const TOP_Y = 0.0;
const ROLLERS = 26;

/**
 * Isometric conveyor belt: a metal bed with side rails and rotating rollers,
 * plus a flowing warm "data stream" of instanced dots along the top that fills
 * to the current progress. Replaces the meadow path in the factory view.
 */
export function ConveyorBelt({
  cursorT,
  active,
  streamCount = 40,
}: {
  cursorT: number;
  active: boolean;
  streamCount?: number;
}) {
  const rollers = useRef<THREE.InstancedMesh>(null);
  const stream = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  const x0 = -BELT_LENGTH / 2;

  // Warm Valley gradient for the data stream: grass → gold → blue.
  const grad = useMemo(
    () => [new THREE.Color("#10b981"), new THREE.Color("#f5d76e"), new THREE.Color("#3b97f3")],
    [],
  );

  const rollerGeo = useMemo(() => new THREE.CylinderGeometry(0.22, 0.22, WIDTH, 12), []);
  const streamGeo = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);
  useEffect(() => {
    return () => {
      rollerGeo.dispose();
      streamGeo.dispose();
    };
  }, [rollerGeo, streamGeo]);

  // Place rollers once.
  useEffect(() => {
    const mesh = rollers.current;
    if (!mesh) return;
    for (let i = 0; i < ROLLERS; i += 1) {
      const x = x0 + (i / (ROLLERS - 1)) * BELT_LENGTH;
      dummy.position.set(x, TOP_Y - 0.18, 0);
      dummy.rotation.set(Math.PI / 2, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy, x0]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Flow the data stream within the traveled portion.
    const mesh = stream.current;
    if (mesh) {
      const reach = Math.max(0.04, cursorT);
      for (let i = 0; i < streamCount; i += 1) {
        const base = i / streamCount;
        const flow = active ? t * 0.08 : 0;
        const f = ((base + flow) % 1) * reach;
        const x = x0 + f * BELT_LENGTH;
        const lane = (i % 3) - 1;
        dummy.position.set(x, TOP_Y + 0.16, lane * 0.55);
        const s = active ? 0.07 + Math.sin(t * 5 + i) * 0.02 : 0.05;
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        tmpColor.copy(grad[i % 3]);
        mesh.setColorAt(i, tmpColor);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Belt bed */}
      <mesh position={[0, TOP_Y - 0.22, 0]} receiveShadow castShadow>
        <boxGeometry args={[BELT_LENGTH + 1, 0.4, WIDTH]} />
        <meshStandardMaterial color="#cdd7df" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Belt top surface (slightly warm) */}
      <mesh position={[0, TOP_Y, 0]} receiveShadow>
        <boxGeometry args={[BELT_LENGTH + 0.6, 0.06, WIDTH - 0.2]} />
        <meshStandardMaterial color="#eef3f6" roughness={0.5} />
      </mesh>
      {/* Side rails */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, TOP_Y + 0.05, s * (WIDTH / 2)]} castShadow>
          <boxGeometry args={[BELT_LENGTH + 0.8, 0.18, 0.12]} />
          <meshStandardMaterial color="#aebcc6" roughness={0.5} metalness={0.4} />
        </mesh>
      ))}

      <instancedMesh ref={rollers} args={[rollerGeo, undefined, ROLLERS]}>
        <meshStandardMaterial color="#9fb0bb" roughness={0.4} metalness={0.5} />
      </instancedMesh>

      <instancedMesh ref={stream} args={[streamGeo, undefined, streamCount]}>
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
