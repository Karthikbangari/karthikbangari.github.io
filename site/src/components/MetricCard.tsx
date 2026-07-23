import { useEffect, useState } from "react";
import type { Metric } from "../data/metrics";

const numberPattern = /^(\d+(?:\.\d+)?)(.*)$/;

export function CountUp({ value, inView }: { value: string; inView: boolean }) {
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

export default function MetricCard({
  metric,
  inView,
  rotate = "0deg",
  big = false,
}: {
  metric: Metric;
  inView: boolean;
  rotate?: string;
  big?: boolean;
}) {
  return (
    <div
      className="rounded-sm bg-paper px-6 py-5 text-navy shadow-[0_10px_24px_rgba(12,12,12,0.18)]"
      style={{ transform: `rotate(${rotate})` }}
    >
      <div
        className={`font-display font-bold text-blue ${
          big ? "text-6xl sm:text-8xl" : "text-3xl sm:text-4xl"
        }`}
      >
        <CountUp value={metric.value} inView={inView} />
      </div>
      <div
        className={`mt-2 font-display font-semibold text-navy ${big ? "text-xl sm:text-2xl" : "text-sm"}`}
      >
        {metric.label}
      </div>
      <p className={`mt-1 text-muted-ink ${big ? "text-base" : "text-xs"}`}>{metric.description}</p>
    </div>
  );
}
