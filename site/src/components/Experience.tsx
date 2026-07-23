import { ArrowUpCircle } from "lucide-react";
import { experienceStages } from "../data/experience";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">03 — Experience</p>
      <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
        Four years of infrastructure, delivery and reliability engineering.
      </h2>

      <div className="relative mt-14 pl-8 sm:pl-10">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-blue via-white/20 to-signal sm:left-[11px]" />

        {experienceStages.map((stage) => (
          <div key={stage.year} className="relative pb-14 last:pb-0">
            <div className="absolute -left-8 top-1 h-4 w-4 rounded-full border-2 border-blue bg-navy sm:-left-10" />

            {stage.promotion && (
              <div className="mb-4 flex items-center gap-2 font-mono text-xs text-signal">
                <ArrowUpCircle size={14} />
                Promotion
              </div>
            )}

            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-sm text-muted">{stage.year}</span>
              <h3 className="font-display text-xl font-semibold text-paper sm:text-2xl">
                {stage.title}
              </h3>
              {stage.dateRange && (
                <span className="font-mono text-xs text-muted">{stage.dateRange}</span>
              )}
            </div>

            <ul className="mt-4 space-y-1.5 font-mono text-sm text-muted">
              {stage.highlights.map((h, idx) => (
                <li key={h} className="flex gap-2">
                  <span className="text-blue-light">
                    {idx === stage.highlights.length - 1 ? "└──" : "├──"}
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
