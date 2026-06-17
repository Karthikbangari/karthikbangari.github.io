import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { stationPositions } from "./path";

// Fixed isometric offset from the look target (belt runs along X).
const OFF = new THREE.Vector3(7, 9.5, 12);

/**
 * Orthographic isometric rig. The camera keeps a constant iso angle and simply
 * pans along the belt (X) to frame the focused station, easing zoom in/out with
 * GSAP. No orbit — the angle never changes, so it reads as true isometric.
 */
export function CameraRig({ focusIndex }: { focusIndex: number | null }) {
  const { camera, size } = useThree();
  const cam = useRef({ cx: 0, zoom: 40 });
  const look = useRef(new THREE.Vector3());

  const baseZoom = Math.max(26, Math.min(58, size.width / 26));

  useEffect(() => {
    const focused = focusIndex !== null && stationPositions[focusIndex];
    const dest = {
      cx: focused ? stationPositions[focusIndex].x : 0,
      zoom: focused ? baseZoom * 1.18 : baseZoom * 0.92,
    };
    const tween = gsap.to(cam.current, {
      ...dest,
      duration: 1.0,
      ease: "power2.inOut",
      overwrite: true,
    });
    return () => {
      tween.kill();
    };
  }, [focusIndex, baseZoom]);

  useFrame((state) => {
    const { cx, zoom } = cam.current;
    // Subtle idle drift keeps the shot alive without breaking the iso angle.
    const sway = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    camera.position.set(cx + OFF.x + sway, OFF.y, OFF.z);
    look.current.set(cx, 0.2, 0);
    camera.lookAt(look.current);
    const ortho = camera as THREE.OrthographicCamera;
    if (Math.abs(ortho.zoom - zoom) > 0.01) {
      ortho.zoom = zoom;
      ortho.updateProjectionMatrix();
    }
  });

  return null;
}
