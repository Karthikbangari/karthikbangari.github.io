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

        <div ref={(el) => registerRef("featured", el)} className="mt-6 rounded-sm bg-paper p-6 text-navy">
          <span className="rounded-full bg-navy px-3 py-1 font-mono text-xs text-signal">
            {featuredBuild.tagline}
          </span>
          <h3 className="mt-3 font-display text-2xl font-bold text-navy">{featuredBuild.name}</h3>
          <p className="mt-2 max-w-xl text-sm text-muted-ink">{featuredBuild.description}</p>
        </div>

        <div ref={(el) => registerRef("grid", el)} className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {labProjects.slice(0, 6).map((p) => (
            <div key={p.name} className="rounded-sm bg-navy/50 p-3">
              <p className="font-display text-sm font-semibold text-paper">{p.name}</p>
              <p className="mt-1 font-mono text-[11px] text-signal">{p.status}</p>
            </div>
          ))}
        </div>

        <div ref={(el) => registerRef("stack", el)} className="mt-6 flex flex-wrap gap-2">
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
  );
}