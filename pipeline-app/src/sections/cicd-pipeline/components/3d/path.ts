import * as THREE from "three";
import { PIPELINE_STAGES } from "../../pipelineConfig";

// Winding meadow path through the valley. Anchor points snake across x with a
// gentle z-weave so the path reads as a country lane rather than a straight bus.
const N = PIPELINE_STAGES.length;
const GROUND_Y = -2.05;

const anchors: THREE.Vector3[] = PIPELINE_STAGES.map((_, i) => {
  const x = -8.4 + (i / (N - 1)) * 16.8;
  const z = Math.sin(i * 0.95) * 2.1 - 0.4;
  return new THREE.Vector3(x, GROUND_Y, z);
});

export const pathCurve = new THREE.CatmullRomCurve3(
  anchors,
  false,
  "catmullrom",
  0.5,
);

/** Even param (0..1) for station i, shared by stations + travelling artifact. */
export const stationT = (i: number): number => i / (N - 1);

/** World position of each station, sampled on the curve so artifact aligns. */
export const stationPositions: THREE.Vector3[] = PIPELINE_STAGES.map((_, i) =>
  pathCurve.getPoint(stationT(i)),
);

export const GROUND = GROUND_Y;
