import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Valley palette (matches the site tokens).
const C = {
  sun: "#f5e6a0",
  sunCore: "#fff4cf",
  hillBack: "#cde6c0",
  hillFront: "#a8dc8a",
  grass: "#7ccb5b",
  cloud: "#ffffff",
  sheep: "#fbfbf7",
  wood: "#caa873",
  mill: "#eef3f6",
};

/** Soft pale-yellow sun with a glow halo, up and to the left. */
function Sun() {
  return (
    <group position={[-6.5, 4.2, -8]}>
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial color={C.sunCore} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial color={C.sun} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/** Layered rolling hills built from wide, flattened spheres. */
function Hills() {
  return (
    <group position={[0, -2.4, 0]}>
      <mesh receiveShadow position={[-3, -0.6, -6]} scale={[10, 3.2, 6]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color={C.hillBack} roughness={1} />
      </mesh>
      <mesh receiveShadow position={[4, -0.9, -4]} scale={[9, 3, 6]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color={C.hillBack} roughness={1} />
      </mesh>
      {/* Front meadow */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 2]}>
        <planeGeometry args={[40, 22]} />
        <meshStandardMaterial color={C.hillFront} roughness={1} />
      </mesh>
    </group>
  );
}

/** A puffy cloud made of merged spheres that drifts and wraps around. */
function Cloud({
  geometry,
  material,
  x,
  y,
  z,
  speed,
  scale,
}: {
  geometry: THREE.SphereGeometry;
  material: THREE.Material;
  x: number;
  y: number;
  z: number;
  speed: number;
  scale: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    g.position.x += delta * speed;
    if (g.position.x > 11) g.position.x = -11;
  });
  return (
    <group ref={ref} position={[x, y, z]} scale={scale}>
      <mesh geometry={geometry} material={material} />
      <mesh geometry={geometry} material={material} position={[0.9, -0.1, 0]} scale={0.8} />
      <mesh geometry={geometry} material={material} position={[-0.9, -0.15, 0]} scale={0.7} />
      <mesh geometry={geometry} material={material} position={[0.3, 0.35, 0.2]} scale={0.75} />
    </group>
  );
}

/** Small low-poly sheep that grazes slowly across the meadow. */
function Sheep({
  bodyGeo,
  bodyMat,
  legGeo,
  legMat,
  x,
  z,
  speed,
}: {
  bodyGeo: THREE.SphereGeometry;
  bodyMat: THREE.Material;
  legGeo: THREE.CylinderGeometry;
  legMat: THREE.Material;
  x: number;
  z: number;
  speed: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    g.position.x += delta * speed;
    if (g.position.x > 8) g.position.x = -8;
  });
  return (
    <group ref={ref} position={[x, -2.15, z]} scale={0.5}>
      <mesh geometry={bodyGeo} material={bodyMat} castShadow scale={[1.3, 1, 1]} />
      <mesh geometry={bodyGeo} material={legMat} position={[0.95, 0.15, 0]} scale={0.55} />
      {[
        [-0.4, -0.3],
        [0.4, -0.3],
        [-0.4, 0.3],
        [0.4, 0.3],
      ].map(([lx, lz], i) => (
        <mesh
          key={i}
          geometry={legGeo}
          material={legMat}
          position={[lx, -0.7, lz]}
        />
      ))}
    </group>
  );
}

/** Rotating four-blade windmill on a wooden tower. */
function Windmill() {
  const blades = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (blades.current) blades.current.rotation.z += delta * 0.7;
  });
  return (
    <group position={[5.4, -1.4, -1.5]}>
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.32, 3.2, 10]} />
        <meshStandardMaterial color={C.wood} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.7, 0.35]}>
        <boxGeometry args={[0.5, 0.5, 0.3]} />
        <meshStandardMaterial color={C.mill} roughness={0.8} />
      </mesh>
      <group ref={blades} position={[0, 1.7, 0.55]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]} position={[0, 0.7, 0]}>
            <boxGeometry args={[0.16, 1.4, 0.05]} />
            <meshStandardMaterial color={C.mill} roughness={0.7} />
          </mesh>
        ))}
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 8]} />
          <meshStandardMaterial color={C.wood} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Ambient valley scaffold (Phase 2). Geometries/materials are created once and
 * shared across instances; everything is disposed when the scene unmounts.
 */
export function ValleyAmbience() {
  const shared = useMemo(() => {
    const cloudGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: C.cloud,
      roughness: 1,
      emissive: new THREE.Color("#eef6ff"),
      emissiveIntensity: 0.25,
    });
    const sheepBody = new THREE.SphereGeometry(0.5, 16, 16);
    const sheepMat = new THREE.MeshStandardMaterial({ color: C.sheep, roughness: 1 });
    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 6);
    const legMat = new THREE.MeshStandardMaterial({ color: "#3a3a3a", roughness: 1 });
    return { cloudGeo, cloudMat, sheepBody, sheepMat, legGeo, legMat };
  }, []);

  // Dispose shared geometries/materials on unmount (no leaks — see Phase 5).
  useEffect(() => {
    return () => {
      Object.values(shared).forEach((resource) => resource.dispose());
    };
  }, [shared]);

  return (
    <group>
      <Sun />
      <Hills />
      <Windmill />

      <Cloud geometry={shared.cloudGeo} material={shared.cloudMat} x={-5} y={3.4} z={-5} speed={0.35} scale={1.1} />
      <Cloud geometry={shared.cloudGeo} material={shared.cloudMat} x={2} y={4.1} z={-7} speed={0.22} scale={1.4} />
      <Cloud geometry={shared.cloudGeo} material={shared.cloudMat} x={7} y={2.9} z={-4} speed={0.3} scale={0.9} />

      <Sheep bodyGeo={shared.sheepBody} bodyMat={shared.sheepMat} legGeo={shared.legGeo} legMat={shared.legMat} x={-3} z={2} speed={0.18} />
      <Sheep bodyGeo={shared.sheepBody} bodyMat={shared.sheepMat} legGeo={shared.legGeo} legMat={shared.legMat} x={1} z={3.2} speed={0.12} />
      <Sheep bodyGeo={shared.sheepBody} bodyMat={shared.sheepMat} legGeo={shared.legGeo} legMat={shared.legMat} x={4} z={1.4} speed={0.15} />
    </group>
  );
}
