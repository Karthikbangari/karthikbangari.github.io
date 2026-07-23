import { experienceStages } from "../data/experience";

export default function Experience() {
  return (
    <section id="experience" className="relative overflow-hidden bg-cream px-6 py-24 text-navy">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue">03 — Experience</p>
      <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold sm:text-5xl">
        Four years of infrastructure, delivery and reliability engineering.
      </h2>

      <div className="relative mx-auto mt-16 max-w-4xl pl-8 sm:pl-12">
        <svg
          aria-hidden="true"
          viewBox="0 0 4 100"
          preserveAspectRatio="none"
          className="absolute left-0 top-2 h-[calc(100%-16px)] w-1 sm:left-2"
        >
          <path d="M2 0 C 0 25, 4 50, 2 75 C 0 90, 4 95, 2 100" stroke="#173DE5" strokeWidth="3" fill="none" />
        </svg>

        {experienceStages.map((stage) => (
          <div key={stage.year} className="relative pb-16 last:pb-0">
            <div className="absolute -left-8 top-1 h-4 w-4 rounded-full border-2 border-blue bg-cream sm:-left-12" />

            {stage.promotion && (
              <span className="mb-4 inline-block -rotate-3 rounded-sm bg-signal px-3 py-1 font-note text-lg text-navy shadow-[0_6px_16px_rgba(12,12,12,0.2)]">
                Promoted ↑
              </span>
            )}

            <div className="rounded-sm bg-paper p-6 shadow-[0_10px_24px_rgba(12,12,12,0.12)] sm:p-8">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-sm text-blue">{stage.year}</span>
                <h3 className="font-display text-2xl font-bold text-navy sm:text-3xl">
                  {stage.title}
                </h3>
                {stage.dateRange && (
                  <span className="font-mono text-xs text-muted-ink">{stage.dateRange}</span>
                )}
              </div>

              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-ink">
                {stage.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
