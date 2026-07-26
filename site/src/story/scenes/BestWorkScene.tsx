import { caseStudies } from "../../data/projects";

export default function BestWorkScene({
  registerTrack,
  registerPanel,
  registerDot,
}: {
  registerTrack: (el: HTMLDivElement | null) => void;
  registerPanel: (index: number, el: HTMLDivElement | null) => void;
  registerDot: (index: number, el: HTMLDivElement | null) => void;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-navy text-paper">
      <div ref={registerTrack} className="flex h-full">
        {caseStudies.map((study, i) => (
          <div
            key={study.slug}
            ref={(el) => registerPanel(i, el)}
            className="flex h-full w-full shrink-0 flex-col justify-center px-10 py-16 sm:px-16"
          >
            <div className="mx-auto w-full max-w-4xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
                04 — Best Work · {i + 1} / {caseStudies.length}
              </p>

              <div className="mt-4 flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-signal font-hand text-2xl text-signal">
                  {study.index.replace(/^0/, "")}
                </span>
                <p className="font-mono text-xs text-paper/60">
                  {study.tags.slice(0, 4).join(" · ")}
                </p>
              </div>

              <h3 className="mt-6 max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {study.title}
              </h3>

              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-signal">
                    The problem
                  </h4>
                  <ul className="mt-3 space-y-1.5 text-sm text-paper/80">
                    {study.problem.slice(0, 4).map((p) => (
                      <li key={p}>— {p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-signal">
                    Architecture
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {study.architecture.map((stage) => (
                      <span
                        key={stage}
                        className="rounded border border-paper/30 px-2 py-1 font-mono text-xs"
                      >
                        {stage}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {study.impact.map((item) => (
                  <div
                    key={item}
                    className="rounded-sm bg-surface px-4 py-3 font-mono text-sm text-signal"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-20 left-1/2 flex -translate-x-1/2 items-center gap-2.5">
        {caseStudies.map((study, i) => (
          <div
            key={study.slug}
            ref={(el) => registerDot(i, el)}
            className="h-1.5 w-1.5 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}