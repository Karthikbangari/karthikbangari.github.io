import * as THREE from "three";
import { PIPELINE_STAGES } from "../../pipelineConfig";

// Straight conveyor belt running along X for the isometric factory view.
// A tiny z-weave keeps it from looking perfectly flat under the iso camera.
const N = PIPELINE_STAGES.length;
const BELT_Y = 0;
const SPAN = 24; // total belt length in world units

const anchors: THREE.Vector3[] = PIPELINE_STAGES.map((_, i) => {
  const x = -SPAN / 2 + (i / (N - 1)) * SPAN;
  const z = 0;
  return new THREE.Vector3(x, BELT_Y, z);
});

export const pathCurve = new THREE.CatmullRomCurve3(
  anchors,
  false,
  "catmullrom",
  0.5,
);

/** Even param (0..1) for station i, shared by stations + travelling artifact. */
export const stationT = (i: number): number => i / (N - 1);

/** World position of each station on the belt. */
export const stationPositions: THREE.Vector3[] = PIPELINE_STAGES.map((_, i) =>
  pathCurve.getPoint(stationT(i)),
);

export const BELT_LENGTH = SPAN;
export const GROUND = BELT_Y;
