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
