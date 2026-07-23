import { useEffect, useState } from "react";
import type { Metric } from "../data/metrics";

const numberPattern = /^(\d+(?:\.\d+)?)(.*)$/;

function CountUp({ value, inView }: { value: string; inView: boolean }) {
  const match = value.match(numberPattern);
  const [display, setDisplay] = useState(match ? "0" + match[2] : value);

  useEffect(() => {
    if (!inView || !match) {
      if (!match) setDisplay(value);
      return;
    }

    const target = parseFloat(match[1]);
    const suffix = match[2];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const duration = 900;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const current = target * progress;
      const formatted = Number.isInteger(target) ? Math.round(current) : current.toFixed(1);
      setDisplay(`${formatted}${suffix}`);
      if (progress < 1) requestAnimationFrame(step);
    };

    const frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return <>{display}</>;
}

export default function MetricCard({ metric, inView }: { metric: Metric; inView: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface/60 p-6">
      <div className="font-display text-4xl font-bold text-signal sm:text-5xl">
        <CountUp value={metric.value} inView={inView} />
      </div>
      <div className="mt-3 font-display text-base font-semibold text-paper">{metric.label}</div>
      <p className="mt-1 text-sm text-muted">{metric.description}</p>
    </div>
  );
}
