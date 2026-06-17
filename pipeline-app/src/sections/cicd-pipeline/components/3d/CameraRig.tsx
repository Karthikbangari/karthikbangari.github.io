import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { stationPositions } from "./path";

interface OrbitLike {
  target: { x: number; y: number; z: number };
  update: () => void;
}

/**
 * Focus the OrbitControls target on the selected station (GSAP eased pan along
 * the belt). OrbitControls owns the camera, so the user can still orbit/zoom;
 * we only glide the look-at point. No direct camera manipulation = no fighting.
 */
export function CameraRig({ focusIndex }: { focusIndex: number | null }) {
  const controls = useThree((s) => s.controls) as unknown as OrbitLike | null;

  useEffect(() => {
    if (!controls || focusIndex === null) return;
    const station = stationPositions[focusIndex];
    if (!station) return;
    const tween = gsap.to(controls.target, {
      x: station.x + 1.5,
      y: 0.4,
      z: station.z,
      duration: 1.0,
      ease: "power2.inOut",
      overwrite: true,
      onUpdate: () => controls.update(),
    });
    return () => {
      tween.kill();
    };
  }, [controls, focusIndex]);

  return null;
}
