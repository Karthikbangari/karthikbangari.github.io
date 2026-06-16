import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  GitBranch,
  Wrench,
  ShieldCheck,
  Boxes,
  Layers,
  Ship,
  GitMerge,
  Activity,
  type LucideIcon,
} from "lucide-react";
import gsap from "gsap";
import { usePipeline } from "../PipelineProvider";
import { PIPELINE_STAGES } from "../pipelineConfig";
import styles from "../styles.module.css";

const STATION_ICONS: LucideIcon[] = [
  GitBranch,
  Wrench,
  ShieldCheck,
  Boxes,
  Layers,
  Ship,
  GitMerge,
  Activity,
];

const TRAIL_COUNT = 4;

interface Pt {
  x: number;
  y: number;
}

/** Catmull-Rom → cubic-bezier for a gently rounded rail through the points. */
function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Which station the train should currently be parked at / heading to. */
function deriveTarget(
  phase: string,
  statuses: string[],
  activeIndex: number,
  rolledBack: boolean,
): number {
  const n = statuses.length;
  if (phase === "failed") {
    const f = statuses.indexOf("failed");
    return f >= 0 ? f : activeIndex;
  }
  if (phase === "rollingBack" || rolledBack) {
    const ls = statuses.lastIndexOf("success");
    return ls >= 0 ? ls : 0;
  }
  if (phase === "completed") return n - 1;
  return Math.max(activeIndex, 0);
}

export function PipelineNavigation() {
  const { state, dispatch, artifact } = usePipeline();
  const { statuses, activeIndex, selectedIndex, phase, rolledBack } = state;

  const wrapRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const basePathRef = useRef<SVGPathElement>(null);
  const trailPathRef = useRef<SVGPathElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const trailDotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Geometry kept in refs (no re-render churn); only the path string is state.
  const nodeLensRef = useRef<number[]>([]);
  const totalLenRef = useRef(0);
  const lenRef = useRef(0); // current capsule length along the rail
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const movingRef = useRef(false);
  const placedRef = useRef(false);

  const [pathD, setPathD] = useState("");
  const [dims, setDims] = useState({ w: 0, h: 0 });

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Paint the capsule + trail + trailing dots at a given length along the rail.
  const paint = useCallback((len: number) => {
    const path = basePathRef.current;
    const cap = capsuleRef.current;
    const total = totalLenRef.current;
    if (!path || !cap || total <= 0) return;
    const clamped = Math.max(0, Math.min(len, total));
    const p = path.getPointAtLength(clamped);
    cap.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;

    if (trailPathRef.current) {
      trailPathRef.current.style.strokeDashoffset = `${total - clamped}`;
    }
    trailDotRefs.current.forEach((dot, k) => {
      if (!dot) return;
      const dl = Math.max(0, clamped - (k + 1) * 9);
      const dp = path.getPointAtLength(dl);
      dot.style.transform = `translate(${dp.x}px, ${dp.y}px) translate(-50%, -50%)`;
      dot.style.opacity = movingRef.current ? `${0.5 - k * 0.11}` : "0";
    });
  }, []);

  // Animate the capsule to a target station node.
  const travelTo = useCallback(
    (targetLen: number, opts?: { immediate?: boolean }) => {
      tweenRef.current?.kill();
      const total = totalLenRef.current;
      if (total <= 0) return;
      const from = lenRef.current;
      const to = Math.max(0, Math.min(targetLen, total));

      if (opts?.immediate || reducedMotion) {
        lenRef.current = to;
        movingRef.current = false;
        capsuleRef.current?.classList.remove(styles.capsuleMoving);
        paint(to);
        return;
      }
      if (to === from) return;

      const proxy = { len: from };
      const dist = Math.abs(to - from) / total;
      const duration = Math.min(1.3, Math.max(0.45, dist * 6));
      movingRef.current = true;
      capsuleRef.current?.classList.add(styles.capsuleMoving);
      tweenRef.current = gsap.to(proxy, {
        len: to,
        duration,
        ease: "power2.inOut",
        onUpdate: () => {
          lenRef.current = proxy.len;
          paint(proxy.len);
        },
        onComplete: () => {
          movingRef.current = false;
          capsuleRef.current?.classList.remove(styles.capsuleMoving);
          paint(to);
        },
      });
      // If we start a hop while paused, keep it frozen until Resume.
      if (phase === "paused") tweenRef.current.pause();
    },
    [paint, reducedMotion, phase],
  );

  // Measure icon centres relative to the wrap and (re)build the rail path.
  const remeasure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wr = wrap.getBoundingClientRect();
    const pts: Pt[] = [];
    for (let i = 0; i < PIPELINE_STAGES.length; i += 1) {
      const el = iconRefs.current[i];
      if (!el) return;
      const r = el.getBoundingClientRect();
      pts.push({ x: r.left + r.width / 2 - wr.left, y: r.top + r.height / 2 - wr.top });
    }
    setDims({ w: wr.width, h: wr.height });
    setPathD(smoothPath(pts));
  }, []);

  useLayoutEffect(() => {
    remeasure();
    const wrap = wrapRef.current;
    const ro = new ResizeObserver(() => remeasure());
    if (wrap) ro.observe(wrap);
    window.addEventListener("resize", remeasure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", remeasure);
    };
  }, [remeasure]);

  // After the path renders, measure node lengths + total, then place the train.
  useLayoutEffect(() => {
    const path = basePathRef.current;
    if (!path || !pathD) return;
    const total = path.getTotalLength();
    totalLenRef.current = total;

    // Sample the path once, then snap each icon centre to its nearest length.
    const STEPS = 400;
    const samples: { l: number; x: number; y: number }[] = [];
    for (let s = 0; s <= STEPS; s += 1) {
      const l = (total * s) / STEPS;
      const pt = path.getPointAtLength(l);
      samples.push({ l, x: pt.x, y: pt.y });
    }
    const wrap = wrapRef.current!;
    const wr = wrap.getBoundingClientRect();
    nodeLensRef.current = PIPELINE_STAGES.map((_, i) => {
      const el = iconRefs.current[i]!;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2 - wr.left;
      const cy = r.top + r.height / 2 - wr.top;
      let best = 0;
      let bd = Infinity;
      for (const sm of samples) {
        const d = (sm.x - cx) ** 2 + (sm.y - cy) ** 2;
        if (d < bd) {
          bd = d;
          best = sm.l;
        }
      }
      return best;
    });

    if (trailPathRef.current) {
      trailPathRef.current.style.strokeDasharray = `${total}`;
      trailPathRef.current.style.strokeDashoffset = `${total - lenRef.current}`;
    }

    // First placement: snap to the current target without animating.
    const target = deriveTarget(phase, statuses, activeIndex, rolledBack);
    const targetLen = nodeLensRef.current[target] ?? 0;
    if (!placedRef.current) {
      lenRef.current = targetLen;
      placedRef.current = true;
    }
    paint(lenRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathD, dims.w, dims.h, paint]);

  // Drive the train from the state machine: travel to the derived target.
  useEffect(() => {
    if (totalLenRef.current <= 0 || !nodeLensRef.current.length) return;
    const target = deriveTarget(phase, statuses, activeIndex, rolledBack);
    travelTo(nodeLensRef.current[target] ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, activeIndex, statuses, rolledBack, travelTo]);

  // Pause / resume the active hop with the pipeline phase.
  useEffect(() => {
    if (phase === "paused") tweenRef.current?.pause();
    else tweenRef.current?.resume();
  }, [phase]);

  // Cleanup on unmount.
  useEffect(
    () => () => {
      tweenRef.current?.kill();
    },
    [],
  );

  const warning = phase === "failed" || phase === "rollingBack";

  return (
    <div className={styles.navWrap} ref={wrapRef}>
      {/* Rail overlay (non-interactive) */}
      <svg
        className={styles.rail}
        width={dims.w}
        height={dims.h}
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        aria-hidden
      >
        <path ref={basePathRef} d={pathD} className={styles.railBase} />
        <path
          ref={trailPathRef}
          d={pathD}
          className={`${styles.railTrail} ${warning ? styles.railTrailWarn : ""}`}
        />
        {nodeLensRef.current.length > 0 &&
          PIPELINE_STAGES.map((stage, i) => {
            const path = basePathRef.current;
            if (!path) return null;
            const pt = path.getPointAtLength(nodeLensRef.current[i] ?? 0);
            return (
              <circle
                key={stage.id}
                cx={pt.x}
                cy={pt.y}
                r={4}
                className={`${styles.railNode} ${styles[`node_${statuses[i]}`] ?? ""}`}
              />
            );
          })}
      </svg>

      {/* Trailing particles + the train capsule (non-interactive) */}
      <div className={styles.trainLayer} aria-hidden>
        {Array.from({ length: TRAIL_COUNT }).map((_, k) => (
          <span
            key={k}
            ref={(el) => {
              trailDotRefs.current[k] = el;
            }}
            className={styles.trailDot}
          />
        ))}
        <div ref={capsuleRef} className={styles.capsule}>
          <span className={styles.capsuleCore} />
          <span className={styles.capsuleLabel}>{artifact}</span>
        </div>
      </div>

      <ol className={styles.stations}>
        {PIPELINE_STAGES.map((stage, i) => {
          const Icon = STATION_ICONS[i];
          const status = statuses[i];
          return (
            <li key={stage.id} className={styles.stationItem}>
              <button
                className={[
                  styles.station,
                  styles[`station_${status}`],
                  selectedIndex === i ? styles.stationSelected : "",
                ].join(" ")}
                onClick={() => dispatch({ type: "SELECT_STAGE", index: i })}
                aria-pressed={selectedIndex === i}
              >
                <span
                  className={styles.stationIcon}
                  ref={(el) => {
                    iconRefs.current[i] = el;
                  }}
                >
                  <Icon size={18} aria-hidden />
                </span>
                <span className={styles.stationMeta}>
                  <small>
                    {String(i + 1).padStart(2, "0")} · {stage.tool}
                  </small>
                  <strong>{stage.title}</strong>
                </span>
                <span className={styles.stationStatus} data-status={status} />
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
