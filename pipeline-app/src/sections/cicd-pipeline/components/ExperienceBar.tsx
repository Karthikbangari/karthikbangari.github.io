import { Box, Square, Info } from "lucide-react";
import type { RenderMode } from "../hooks/useRenderMode";
import styles from "../styles.module.css";

interface Props {
  mode: RenderMode;
  /** WebGL available — the 3D toggle is usable. */
  canRender3D: boolean;
  setMode: (mode: RenderMode) => void;
}

export function ExperienceBar({ mode, canRender3D, setMode }: Props) {
  return (
    <div className={styles.expBar}>
      <div className={styles.segmented} role="group" aria-label="Rendering mode">
        <button
          className={`${styles.segment} ${mode === "2d" ? styles.segmentActive : ""}`}
          aria-pressed={mode === "2d"}
          onClick={() => setMode("2d")}
        >
          <Square size={13} aria-hidden /> 2D
        </button>
        <button
          className={`${styles.segment} ${mode === "3d" ? styles.segmentActive : ""}`}
          aria-pressed={mode === "3d"}
          onClick={() => setMode("3d")}
          disabled={!canRender3D}
          title={
            canRender3D
              ? "Interactive 3D valley"
              : "3D needs WebGL, which isn't available in this browser."
          }
        >
          <Box size={13} aria-hidden /> 3D
        </button>
      </div>
      <span className={styles.expHint}>
        <Info size={12} aria-hidden />
        {mode === "3d"
          ? "Interactive 3D valley — click a station to focus it."
          : canRender3D
            ? "2D view — switch to 3D for the interactive valley."
            : "2D view — 3D unavailable (no WebGL); full parity here."}
      </span>
    </div>
  );
}
