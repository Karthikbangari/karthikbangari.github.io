import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pathCurve } from "./path";

/**
 * The visible winding lane plus flowing "data" particles. Particles are a
 * single InstancedMesh (one draw call) that flow along the traversed portion
 * of the path, brighter while the pipeline is active. Particle count scales
 * with the device quality tier.
 */
export function MeadowPath({
  cursorT,
  active,
  count = 48,
}: {
  cursorT: number;
  active: boolean;
  count?: number;
}) {
  const tube = useMemo(
    () => new THREE.TubeGeometry(pathCurve, 120, 0.16, 8, false),
    [],
  );
  // Dispose the manually-created tube geometry on unmount (leak-free).
  useEffect(() => () => tube.dispose(), [tube]);

  const inst = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(
    () => Array.from({ length: count }, (_, i) => i / count),
    [count],
  );

  useFrame((state) => {
    const mesh = inst.current;
    if (!mesh) return;
    const time = state.clock.elapsedTime;
    const reach = Math.max(0.02, cursorT);
    for (let i = 0; i < count; i += 1) {
      // Flow within the traversed segment, wrapping continuously.
      const flow = active ? time * 0.06 : 0;
      const t = ((offsets[i] + flow) % 1) * reach;
      const p = pathCurve.getPoint(t);
      dummy.position.set(p.x, p.y + 0.18, p.z);
      const s = 0.05 + Math.sin(time * 4 + i) * 0.015;
      dummy.scale.setScalar(active ? s : 0.04);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <mesh geometry={tube} receiveShadow>
        <meshStandardMaterial color="#e6dcc4" roughness={1} />
      </mesh>
      <instancedMesh key={count} ref={inst} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          color="#2563eb"
          emissive="#37c0e8"
          emissiveIntensity={1.1}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}
