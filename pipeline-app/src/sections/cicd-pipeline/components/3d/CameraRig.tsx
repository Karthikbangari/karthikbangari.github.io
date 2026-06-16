import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { stationPositions } from "./path";

/**
 * Smooth GSAP camera focus. When the focused station changes, the camera tweens
 * to frame it; with no focus it eases to a wide valley overview. A subtle idle
 * sway keeps the shot alive without disorienting full orbits.
 */
export function CameraRig({ focusIndex }: { focusIndex: number | null }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, -1, 0));
  // Tweened state applied every frame.
  const cam = useRef({ px: 0, py: 2.2, pz: 12, lx: 0, ly: -1, lz: 0 });

  useEffect(() => {
    const overview = { px: 0, py: 2.6, pz: 12.5, lx: 0, ly: -1, lz: -0.5 };
    let dest = overview;

    if (focusIndex !== null && stationPositions[focusIndex]) {
      const s = stationPositions[focusIndex];
      dest = {
        px: s.x * 0.55,
        py: s.y + 3.1,
        pz: s.z + 6.2,
        lx: s.x,
        ly: s.y + 1.1,
        lz: s.z,
      };
    }

    const tween = gsap.to(cam.current, {
      ...dest,
      duration: 1.15,
      ease: "power2.inOut",
      overwrite: true,
    });
    return () => {
      tween.kill();
    };
  }, [focusIndex]);

  useFrame((state) => {
    const sway = Math.sin(state.clock.elapsedTime * 0.25) * 0.25;
    camera.position.set(cam.current.px + sway, cam.current.py, cam.current.pz);
    look.current.set(cam.current.lx, cam.current.ly, cam.current.lz);
    camera.lookAt(look.current);
  });

  return null;
}
