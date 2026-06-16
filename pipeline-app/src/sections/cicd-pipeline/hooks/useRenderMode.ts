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

/**
 * Decide whether this device should get the full 3D experience. The 2D version
 * is a first-class fallback, NOT a downgrade — we only opt into 3D when the
 * device can clearly handle it and the user hasn't asked for reduced motion.
 */
function detectCapable(): boolean {
  if (typeof window === "undefined") return false;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reducedMotion) return false;

  // WebGL support is mandatory for R3F.
  const hasWebGL = (() => {
    try {
      const canvas = document.createElement("canvas");
      return Boolean(
        canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
      );
    } catch {
      return false;
    }
  })();
  if (!hasWebGL) return false;

  // Low-power heuristics: few cores, small/touch screens, or coarse pointers.
  const cores = navigator.hardwareConcurrency ?? 4;
  const isSmall = window.matchMedia("(max-width: 820px)").matches;
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;
  const isMobileUA = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (cores < 4) return false;
  if (isSmall || (isCoarse && isMobileUA)) return false;

  return true;
}

export interface RenderModeState {
  mode: RenderMode;
  capable: boolean;
  tier: QualityTier;
  /** True while the initial capability probe runs (avoids SSR/first-paint flash). */
  ready: boolean;
  setMode: (mode: RenderMode) => void;
  toggle: () => void;
}

export function useRenderMode(): RenderModeState {
  const [capable, setCapable] = useState(false);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<RenderMode>("2d");
  const [tier, setTier] = useState<QualityTier>("medium");

  useEffect(() => {
    const can = detectCapable();
    setCapable(can);
    setMode(can ? "3d" : "2d");
    setTier(detectTier());
    setReady(true);

    // If the user switches on reduced-motion mid-session, fall back to 2D.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (mq.matches) {
        setCapable(false);
        setMode("2d");
      }
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const toggle = useCallback(
    () => setMode((m) => (m === "3d" ? "2d" : "3d")),
    [],
  );

  return { mode, capable, tier, ready, setMode, toggle };
}
