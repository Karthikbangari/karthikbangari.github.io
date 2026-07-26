import { featuredBuild, labProjects } from "../../data/lab";
import { skillGroups } from "../../data/skills";

export type BuildLabRefId = "eyebrow" | "headline" | "featured" | "grid" | "stack";

export default function BuildLabScene({
  registerRef,
}: {
  registerRef: (id: BuildLabRefId, el: HTMLElement | null) => void;
}) {
  return (
    <div className="flex h-full w-full flex-col justify-center overflow-hidden bg-gradient-to-br from-blue to-deep-blue px-10 py-16 text-paper">
      <div className="mx-auto w-full max-w-5xl">
        <p
          ref={(el) => registerRef("eyebrow", el)}
          className="font-mono text-xs uppercase tracking-[0.2em] text-signal"
        >
          05 — Build Lab
        </p>
        <h2 ref={(el) => registerRef("headline", el)} className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          After Hours: Build Lab
        </h2>

        <div
          ref={(el) => registerRef("featured", el)}
          className="mt-6 rounded-lg border-l-4 border-signal bg-paper p-6 text-navy shadow-[0_16px_40px_rgba(0,0,0,0.25)]"
        >
          <span className="rounded-full bg-navy px-3 py-1 font-mono text-xs text-signal">
            {featuredBuild.tagline}
          </span>
          <h3 className="mt-3 font-display text-2xl font-bold text-navy">{featuredBuild.name}</h3>
          <p className="mt-2 max-w-xl text-sm text-muted-ink">{featuredBuild.description}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {featuredBuild.features.slice(0, 6).map((f) => (
              <li
                key={f}
                className="rounded-full border border-navy/15 px-2.5 py-1 font-mono text-[11px] text-muted-ink"
              >
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div ref={(el) => registerRef("grid", el)} className="mt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
            Also building
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {labProjects.slice(0, 6).map((p) => {
              const isShipped = p.status === "Personal project";
              return (
                <div
                  key={p.name}
                  className="rounded-lg border border-paper/15 bg-paper/[0.06] p-3.5"
                >
                  <p className="font-display text-sm font-semibold text-paper">{p.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-paper/60">{p.what}</p>
                  <p
                    className={`mt-1.5 flex items-center gap-1.5 font-mono text-[11px] ${
                      isShipped ? "text-signal" : "text-paper/45"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${isShipped ? "bg-signal" : "border border-paper/45"}`}
                    />
                    {p.status}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div ref={(el) => registerRef("stack", el)} className="mt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
            Tech stack
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {skillGroups
              .flatMap((g) => g.skills)
              .slice(0, 14)
              .map((s) => (
                <span
                  key={s.name}
                  className="rounded-full border border-paper/30 px-3 py-1 font-mono text-xs text-paper/80"
                >
                  {s.name}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}