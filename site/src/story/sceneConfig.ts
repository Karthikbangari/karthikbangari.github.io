export type SceneId =
  | "cover"
  | "originBio"
  | "originImpact"
  | "originTimeline"
  | "lineArt"
  | "projectIntro"
  | "bestWork0"
  | "bestWork1"
  | "bestWork2"
  | "buildLab"
  | "contact";

export const SCENES: { id: SceneId; navLabel: string }[] = [
  { id: "cover", navLabel: "Home" },
  { id: "originBio", navLabel: "Origin" },
  { id: "originImpact", navLabel: "Impact" },
  { id: "originTimeline", navLabel: "Path" },
  { id: "lineArt", navLabel: "Craft" },
  { id: "projectIntro", navLabel: "Projects" },
  { id: "bestWork0", navLabel: "GitOps" },
  { id: "bestWork1", navLabel: "Terraform" },
  { id: "bestWork2", navLabel: "Observability" },
  { id: "buildLab", navLabel: "Build Lab" },
  { id: "contact", navLabel: "Contact" },
];

// Relative scroll "weight" per scene — every scene here is now a single
// full-page beat (no more internal sub-beat scrubbing), so weights just
// tune how long each page dwells before crossfading to the next.
export const SCENE_WEIGHT: Record<SceneId, number> = {
  cover: 1,
  originBio: 1,
  originImpact: 0.8,
  originTimeline: 0.9,
  lineArt: 0.6,
  projectIntro: 0.6,
  bestWork0: 1,
  bestWork1: 1,
  bestWork2: 1,
  buildLab: 0.9,
  contact: 1,
};
