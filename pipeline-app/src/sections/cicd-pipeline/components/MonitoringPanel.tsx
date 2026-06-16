import { useEffect, useRef, useState } from "react";
import { Activity, Bell, ServerCog, Boxes } from "lucide-react";
import { usePipeline } from "../PipelineProvider";
import { PIPELINE_STAGES } from "../pipelineConfig";
import { Sparkline } from "./Sparkline";
import styles from "../styles.module.css";

const OBS = PIPELINE_STAGES.findIndex((s) => s.id === "observability");
const DEPLOY = PIPELINE_STAGES.findIndex((s) => s.id === "deploy-eks");
const POINTS = 20;

// Traffic split per strategy — drives the small release visual in 2D.
const TRAFFIC: Record<string, { label: string; stable: number; next: number }[]> =
  {
    rolling: [{ label: "Rolling update", stable: 0, next: 100 }],
    canary: [
      { label: "Canary 10%", stable: 90, next: 10 }, // DEMO DATA
      { label: "Canary 25%", stable: 75, next: 25 },
      { label: "Canary 50%", stable: 50, next: 50 },
      { label: "Promoted 100%", stable: 0, next: 100 },
    ],
    "blue-green": [
      { label: "Blue (current) 100%", stable: 100, next: 0 },
      { label: "Switch → Green 100%", stable: 0, next: 100 },
    ],
  };

const seed = (v: number) => Array.from({ length: POINTS }, () => v);

export function MonitoringPanel() {
  const { state } = usePipeline();
  const { phase, strategy, rolledBack } = state;

  const reached = state.statuses[OBS] === "success" || phase === "completed";
  const live = reached && !rolledBack;
  const unhealthy = phase === "rollingBack" || state.statuses[DEPLOY] === "failed";

  // Animated chart series. Random-walk around baselines; error rate spikes
  // while unhealthy. Respects reduced-motion (then static).
  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [cpu, setCpu] = useState(seed(42));
  const [mem, setMem] = useState(seed(58));
  const [req, setReq] = useState(seed(1200));
  const [err, setErr] = useState(seed(0.08));

  useEffect(() => {
    if (reducedMotion.current) return;
    const push = (arr: number[], v: number) => [...arr.slice(1), v];
    const id = window.setInterval(() => {
      const wobble = (base: number, amp: number) => base + (Math.random() - 0.5) * amp;
      setCpu((a) => push(a, reached ? wobble(unhealthy ? 78 : 42, 8) : 4));
      setMem((a) => push(a, reached ? wobble(unhealthy ? 71 : 58, 6) : 6));
      setReq((a) => push(a, reached ? wobble(1200, 180) : 0));
      setErr((a) => push(a, reached ? (unhealthy ? wobble(4.6, 1.2) : wobble(0.08, 0.05)) : 0));
    }, 700);
    return () => window.clearInterval(id);
  }, [reached, unhealthy]);

  const splits = TRAFFIC[strategy];
  const last = (a: number[]) => a[a.length - 1];

  const deployStatus = rolledBack
    ? "Rolled back → stable"
    : unhealthy
      ? "Unhealthy — rolling back"
      : reached
        ? "Healthy · 4/4 ready"
        : state.statuses[DEPLOY] === "running"
          ? "Rolling out…"
          : "Not deployed";

  const alert = rolledBack
    ? { tone: "fail", text: "SLO breach → automatic rollback fired & resolved" }
    : unhealthy
      ? { tone: "fail", text: "Prometheus alert: error-rate over budget" }
      : phase === "failed"
        ? { tone: "fail", text: "Pipeline halted — release blocked before production" }
        : live
          ? { tone: "ok", text: "All SLOs within budget — no active alerts" }
          : { tone: "idle", text: "Awaiting release — telemetry not yet live" };

  const podsBad = unhealthy && !rolledBack;

  return (
    <div className={styles.monitor}>
      <div className={styles.monitorHead}>
        <Activity size={15} aria-hidden /> Observability & Release Health
      </div>

      {/* Golden-signal charts */}
      <div className={styles.charts}>
        <Sparkline label="CPU" value={live ? `${Math.round(last(cpu))}%` : "—"} data={cpu} color="#2563eb" min={0} max={100} />
        <Sparkline label="Memory" value={live ? `${Math.round(last(mem))}%` : "—"} data={mem} color="#0ea5a3" min={0} max={100} />
        <Sparkline label="Req/s" value={live ? `${Math.round(last(req))}` : "—"} data={req} color="#7c5cff" />
        <Sparkline
          label="Error rate"
          value={live ? `${last(err).toFixed(2)}%` : "—"}
          data={err}
          color={podsBad ? "#e08a8a" : "#10b981"}
          min={0}
          max={6}
        />
      </div>

      {/* Pod + deployment status */}
      <div className={styles.statusRow}>
        <div className={styles.podStatus}>
          <Boxes size={13} aria-hidden /> Pods
          <span className={styles.pods}>
            {[0, 1, 2, 3].map((i) => (
              <i
                key={i}
                className={`${styles.pod} ${podsBad ? styles.podBad : reached || state.statuses[DEPLOY] === "running" ? styles.podOk : ""}`}
              />
            ))}
          </span>
        </div>
        <div className={styles.deployStatus}>
          <ServerCog size={13} aria-hidden /> {deployStatus}
        </div>
      </div>

      {/* Release traffic split */}
      <div className={styles.release}>
        <div className={styles.releaseHead}>
          <ServerCog size={14} aria-hidden /> Traffic — {strategy}
        </div>
        <div className={styles.splitList}>
          {splits.map((s) => (
            <div key={s.label} className={styles.splitRow}>
              <span className={styles.splitLabel}>{s.label}</span>
              <span className={styles.splitBar}>
                <i style={{ width: `${s.stable}%` }} className={styles.splitStable} />
                <i style={{ width: `${s.next}%` }} className={styles.splitNext} />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Live log stream */}
      <div className={styles.logStream}>
        <div className={styles.logStreamHead}>log stream — {PIPELINE_STAGES[OBS].tool}</div>
        <div className={styles.logStreamBody}>
          {PIPELINE_STAGES[OBS].console.slice(0, state.revealed[OBS]).map((l, i) => (
            <div key={i} className={styles.logLine}>
              {l}
            </div>
          ))}
          {state.revealed[OBS] === 0 && (
            <div className={styles.terminalMuted}>awaiting telemetry…</div>
          )}
        </div>
      </div>

      <div className={`${styles.alert} ${styles[`alert_${alert.tone}`]}`}>
        <Bell size={14} aria-hidden /> {alert.text}
      </div>
    </div>
  );
}
