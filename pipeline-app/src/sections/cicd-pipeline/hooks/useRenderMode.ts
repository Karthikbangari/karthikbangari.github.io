import { useCallback, useEffect, useState } from "react";

export type RenderMode = "2d" | "3d";
/** Quality tier for the 3D scene: high = desktop, medium = smaller/weaker. */
export type QualityTier = "high" | "medium";

function detectTier(): QualityTier {
  if (typeof window === "undefined") return "medium";
  const cores = navigator.hardwareConcurrency ?? 4;
  const wide = window.matchMedia("(min-width: 1180px)").matches;
  return wide && cores >= 8 ? "high" : "medium";
}

/** The ONLY hard requirement for 3D: a working WebGL context. */
function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Whether to DEFAULT to 3D. Any desktop browser with WebGL lands in the 3D
 * valley (the highlight of the section). Only small / mobile / touch devices
 * start in the calmer 2D view. The user can always switch via the toggle.
 */
function detectPrefer3D(): boolean {
  if (!detectWebGL()) return false;

  const isSmall = window.matchMedia("(max-width: 820px)").matches;
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;
  const isMobileUA = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isSmall || (isCoarse && isMobileUA)) return false;
  return true;
}

export interface RenderModeState {
  mode: RenderMode;
  /** WebGL available — the 3D toggle is usable. */
  canRender3D: boolean;
  tier: QualityTier;
  /** True while the initial capability probe runs (avoids SSR/first-paint flash). */
  ready: boolean;
  setMode: (mode: RenderMode) => void;
  toggle: () => void;
}

export function useRenderMode(): RenderModeState {
  const [canRender3D, setCanRender3D] = useState(false);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<RenderMode>("2d");
  const [tier, setTier] = useState<QualityTier>("medium");

  useEffect(() => {
    setCanRender3D(detectWebGL());
    setMode(detectPrefer3D() ? "3d" : "2d");
    setTier(detectTier());
    setReady(true);
  }, []);

  const toggle = useCallback(
    () => setMode((m) => (m === "3d" ? "2d" : "3d")),
    [],
  );

  return { mode, canRender3D, tier, ready, setMode, toggle };
}
