export type SceneId =
  | "cover"
  | "origin"
  | "lineArt"
  | "projectIntro"
  | "bestWork"
  | "buildLabIntro"
  | "buildLabGrid"
  | "buildLabStack"
  | "contact";

export const SCENES: { id: SceneId; navLabel: string }[] = [
  { id: "cover", navLabel: "Home" },
  { id: "origin", navLabel: "Origin" },
  { id: "lineArt", navLabel: "Craft" },
  { id: "projectIntro", navLabel: "Projects" },
  { id: "bestWork", navLabel: "Best Work" },
  { id: "buildLabIntro", navLabel: "Build Lab" },
  { id: "buildLabGrid", navLabel: "Also Building" },
  { id: "buildLabStack", navLabel: "Tech Stack" },
  { id: "contact", navLabel: "Contact" },
];

// Relative scroll "weight" per scene — bigger scenes (canvases you pan
// through) get proportionally more of the track than a brief title card.
export const SCENE_WEIGHT: Record<SceneId, number> = {
  cover: 1,
  origin: 1.6,
  lineArt: 0.7,
  projectIntro: 0.5,
  bestWork: 2,
  buildLabIntro: 0.6,
  buildLabGrid: 0.6,
  buildLabStack: 0.5,
  contact: 1,
};
