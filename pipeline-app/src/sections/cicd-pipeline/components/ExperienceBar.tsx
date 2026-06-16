import { Box, Square, Info } from "lucide-react";
import type { RenderMode } from "../hooks/useRenderMode";
import styles from "../styles.module.css";

interface Props {
  mode: RenderMode;
  capable: boolean;
  setMode: (mode: RenderMode) => void;
}

export function ExperienceBar({ mode, capable, setMode }: Props) {
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
          disabled={!capable}
          title={
            capable
              ? "Interactive 3D valley"
              : "3D disabled — reduced-motion or low-power device. The 2D version has full parity."
          }
        >
          <Box size={13} aria-hidden /> 3D
        </button>
      </div>
      <span className={styles.expHint}>
        <Info size={12} aria-hidden />
        {mode === "3d"
          ? "Valley scene scaffold — interactive stations arrive next."
          : capable
            ? "2D view — switch to 3D for the interactive valley."
            : "2D view — full parity (3D off for reduced-motion / low-power)."}
      </span>
    </div>
  );
}
