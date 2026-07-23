import { metrics, secondaryMetrics } from "../data/metrics";
import { useInView } from "../hooks/useInView";
import MetricCard from "./MetricCard";

export default function ImpactDashboard() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  return (
    <section id="impact" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="font-display text-2xl font-semibold text-paper sm:text-3xl">
        Measurable production impact
      </h2>

      <div ref={ref} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} inView={inView} />
        ))}
      </div>

      <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-muted">
        {secondaryMetrics.map((item) => (
          <li key={item} className="before:mr-2 before:text-signal before:content-['//']">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
