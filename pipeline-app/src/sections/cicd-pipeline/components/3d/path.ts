import * as THREE from "three";
import { PIPELINE_STAGES } from "../../pipelineConfig";

// Curved conveyor route (NOT a straight line): a sweeping S across the floor,
// read nicely under the isometric camera.
const N = PIPELINE_STAGES.length;
const BELT_Y = 0;
const SPAN = 24;

const anchors: THREE.Vector3[] = PIPELINE_STAGES.map((_, i) => {
  const prog = i / (N - 1);
  const x = -SPAN / 2 + prog * SPAN;
  const z = Math.sin(prog * Math.PI * 1.25) * 3.6 - 0.6; // the sweep
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

/** World position of each station, sampled on the curve so the belt aligns. */
export const stationPositions: THREE.Vector3[] = PIPELINE_STAGES.map((_, i) =>
  pathCurve.getPoint(stationT(i)),
);

/** End point + forward tangent, for placing the fork at the line's end. */
export const endPoint = pathCurve.getPoint(1);
export const endTangent = pathCurve.getTangent(1);

export const BELT_LENGTH = SPAN;
export const GROUND = BELT_Y;
