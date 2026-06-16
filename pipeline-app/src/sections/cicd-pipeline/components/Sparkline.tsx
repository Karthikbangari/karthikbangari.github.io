import { useMemo } from "react";
import styles from "../styles.module.css";

interface Props {
  label: string;
  value: string;
  data: number[];
  color: string;
  /** Optional min/max for stable scaling; otherwise derived from data. */
  min?: number;
  max?: number;
}

/** Tiny dependency-free SVG sparkline for the observability charts. */
export function Sparkline({ label, value, data, color, min, max }: Props) {
  const path = useMemo(() => {
    if (data.length < 2) return "";
    const lo = min ?? Math.min(...data);
    const hi = max ?? Math.max(...data);
    const span = hi - lo || 1;
    const w = 100;
    const h = 30;
    return data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((d - lo) / span) * h;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [data, min, max]);

  return (
    <div className={styles.spark}>
      <div className={styles.sparkHead}>
        <small>{label}</small>
        <strong style={{ color }}>{value}</strong>
      </div>
      <svg className={styles.sparkSvg} viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden>
        <path d={path} fill="none" stroke={color} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
