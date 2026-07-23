import { metrics, secondaryMetrics } from "../data/metrics";
import { useInView } from "../hooks/useInView";
import MetricCard from "./MetricCard";
import HandDrawnArrow from "./HandDrawnArrow";

const ROTATIONS = ["-3deg", "2deg", "-2deg", "3deg", "-1.5deg"];

export default function ImpactDashboard() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [hero, ...rest] = metrics;

  return (
    <section id="impact" className="relative overflow-hidden bg-cream px-6 py-24 text-navy">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue">
        Production impact
      </p>
      <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold sm:text-5xl">
        Measurable, not marketing.
      </h2>

      <div ref={ref} className="relative mx-auto mt-14 max-w-5xl">
        <div className="flex justify-center">
          <MetricCard metric={hero} inView={inView} big />
        </div>

        <HandDrawnArrow
          color="#173DE5"
          className="pointer-events-none mx-auto -my-4 hidden h-16 w-24 sm:block"
        />

        <div className="mt-6 flex flex-wrap items-start justify-center gap-6">
          {rest.map((metric, i) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              inView={inView}
              rotate={ROTATIONS[i % ROTATIONS.length]}
            />
          ))}
        </div>
      </div>

      <ul className="relative mx-auto mt-16 flex max-w-4xl flex-wrap justify-center gap-x-10 gap-y-3 font-note text-xl text-blue">
        {secondaryMetrics.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
