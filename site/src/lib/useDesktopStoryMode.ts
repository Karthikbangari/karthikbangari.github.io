import { useState } from "react";
import { prefersReducedMotion } from "./motion";

const BREAKPOINT = 768;

function computeStoryMode() {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= BREAKPOINT && !prefersReducedMotion();
}

// Whether to render the pinned single-viewport "story" experience (desktop,
// motion allowed) vs. the normal-document-flow fallback (mobile or
// prefers-reduced-motion). Decided once per mount via a lazy initializer —
// resizing across the breakpoint mid-session is rare enough that we don't
// chase it live; a refresh picks up the new mode.
export function useDesktopStoryMode() {
  const [storyMode] = useState(computeStoryMode);
  return storyMode;
}
