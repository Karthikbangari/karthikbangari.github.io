import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pathCurve } from "./path";

const WIDTH = 2.2;
const TOP_Y = 0.0;
const SEGMENTS = 70;
const ROLLERS = 26;
const RAINBOW = ["#ff4d6d", "#ff9e3d", "#ffe14d", "#3ddc84", "#22d3ee", "#3b82f6", "#a855f7"];

const UP = new THREE.Vector3(0, 1, 0);

/**
 * Curved isometric conveyor: a segmented belt that follows the S-curve route,
 * with rollers across the belt and a bold rainbow data stream flowing along the
 * curve (always animating). Belt/rollers are instanced (cheap, one draw each).
 */
export function ConveyorBelt({
  active,
  streamCount = 56,
}: {
  active: boolean;
  streamCount?: number;
}) {
  const beltTop = useRef<THREE.InstancedMesh>(null);
  const beltBase = useRef<THREE.InstancedMesh>(null);
  const rollers = useRef<THREE.InstancedMesh>(null);
  const stream = useRef<THREE.InstancedMesh>(null);
  const crates = useRef<THREE.InstancedMesh>(null);
  const frame = useRef(0);

  const CRATES = 6;

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);
  const v = useMemo(() => new THREE.Vector3(), []);
  const perp = useMemo(() => new THREE.Vector3(), []);

  const segGeo = useMemo(() => new THREE.BoxGeometry(1, 0.08, WIDTH - 0.25), []);
  const baseGeo = useMemo(() => new THREE.BoxGeometry(1, 0.34, WIDTH), []);
  const rollerGeo = useMemo(() => new THREE.CylinderGeometry(0.22, 0.22, WIDTH, 12), []);
  const beadGeo = useMemo(() => new THREE.SphereGeometry(1, 10, 10), []);
  const crateGeo = useMemo(() => new THREE.BoxGeometry(0.5, 0.42, 0.5), []);
  useEffect(() => {
    return () => {
      segGeo.dispose();
      baseGeo.dispose();
      rollerGeo.dispose();
      beadGeo.dispose();
      crateGeo.dispose();
    };
  }, [segGeo, baseGeo, rollerGeo, beadGeo, crateGeo]);

  // Lay out the belt segments + rollers along the curve once.
  useEffect(() => {
    const top = beltTop.current;
    const base = beltBase.current;
    const roll = rollers.current;

    const place = (
      mesh: THREE.InstancedMesh | null,
      yOff: number,
      count: number,
      scaleY: number,
    ) => {
      if (!mesh) return;
      for (let i = 0; i < count; i += 1) {
        const t0 = i / count;
        const t1 = (i + 1) / count;
        const p0 = pathCurve.getPoint(t0);
        const p1 = pathCurve.getPoint(t1);
        const mid = p0.clone().lerp(p1, 0.5);
        const len = p0.distanceTo(p1) * 1.25;
        const yaw = Math.atan2(p1.z - p0.z, p1.x - p0.x);
        dummy.position.set(mid.x, TOP_Y + yOff, mid.z);
        dummy.rotation.set(0, -yaw, 0);
        dummy.scale.set(len, scaleY, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    };
    place(top, 0, SEGMENTS, 1);
    place(base, -0.2, SEGMENTS, 1);

    if (roll) {
      for (let i = 0; i < ROLLERS; i += 1) {
        const t = i / (ROLLERS - 1);
        const p = pathCurve.getPoint(t);
        const tan = pathCurve.getTangent(t);
        perp.set(-tan.z, 0, tan.x).normalize();
        dummy.position.set(p.x, TOP_Y - 0.16, p.z);
        dummy.quaternion.setFromUnitVectors(UP, perp);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        roll.setMatrixAt(i, dummy.matrix);
      }
      roll.instanceMatrix.needsUpdate = true;
    }

    const s = stream.current;
    if (s) {
      for (let i = 0; i < streamCount; i += 1) {
        colorObj.set(RAINBOW[i % RAINBOW.length]);
        s.setColorAt(i, colorObj);
      }
      if (s.instanceColor) s.instanceColor.needsUpdate = true;
    }
  }, [dummy, perp, colorObj, streamCount]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const speedC = active ? 0.06 : 0.025;

    // Crates ride the belt (every frame — only a handful, cheap).
    const c = crates.current;
    if (c) {
      for (let i = 0; i < CRATES; i += 1) {
        const f = (i / CRATES + t * speedC) % 1;
        pathCurve.getPoint(f, v);
        const tan = pathCurve.getTangent(f);
        const yaw = Math.atan2(tan.z, tan.x);
        dummy.position.set(v.x, TOP_Y + 0.28, v.z);
        dummy.rotation.set(0, -yaw, 0);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        c.setMatrixAt(i, dummy.matrix);
      }
      c.instanceMatrix.needsUpdate = true;
    }

    // Flow the rainbow stream along the curve (every other frame).
    frame.current += 1;
    if (frame.current % 2 !== 0) return;
    const s = stream.current;
    if (!s) return;
    const speed = active ? 0.12 : 0.045;
    const lanes = 3;
    for (let i = 0; i < streamCount; i += 1) {
      const lane = (i % lanes) - 1;
      const base = (i / streamCount) * lanes;
      const f = (base + t * speed) % 1;
      pathCurve.getPoint(f, v);
      const tan = pathCurve.getTangent(f);
      perp.set(-tan.z, 0, tan.x).normalize();
      dummy.position.set(
        v.x + perp.x * lane * 0.55,
        TOP_Y + 0.16 + Math.sin(t * 3 + i) * 0.015,
        v.z + perp.z * lane * 0.55,
      );
      dummy.scale.setScalar(0.085 + Math.sin(t * 6 + i) * 0.02);
      dummy.updateMatrix();
      s.setMatrixAt(i, dummy.matrix);
    }
    s.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={beltBase} args={[baseGeo, undefined, SEGMENTS]} castShadow receiveShadow>
        <meshStandardMaterial color="#d7e3ec" roughness={0.45} metalness={0.4} />
      </instancedMesh>
      <instancedMesh ref={beltTop} args={[segGeo, undefined, SEGMENTS]} receiveShadow>
        <meshStandardMaterial color="#fdfefe" roughness={0.3} metalness={0.1} />
      </instancedMesh>
      <instancedMesh ref={rollers} args={[rollerGeo, undefined, ROLLERS]}>
        <meshStandardMaterial color="#b9c8d2" roughness={0.35} metalness={0.55} />
      </instancedMesh>
      <instancedMesh ref={stream} args={[beadGeo, undefined, streamCount]}>
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      {/* Cardboard crates riding the belt */}
      <instancedMesh ref={crates} args={[crateGeo, undefined, CRATES]} castShadow>
        <meshStandardMaterial color="#cfa063" roughness={0.85} metalness={0.05} />
      </instancedMesh>
    </group>
  );
}
