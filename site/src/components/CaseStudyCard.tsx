import type { CaseStudy } from "../data/projects";
import StickyNote from "./StickyNote";

function Pipeline({ stages, tone }: { stages: string[]; tone: "on-dark" | "on-light" }) {
  const chip =
    tone === "on-dark"
      ? "border-paper/30 text-paper"
      : "border-navy/20 text-navy bg-paper";
  const arrow = tone === "on-dark" ? "text-signal" : "text-blue";

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-2 font-mono text-xs">
        {stages.map((stage, i) => (
          <span key={stage} className="flex items-center gap-2 whitespace-nowrap">
            <span className={`rounded border px-2 py-1 ${chip}`}>{stage}</span>
            {i < stages.length - 1 && <span className={arrow}>→</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function ImpactStats({ impact }: { impact: string[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {impact.map((item) => (
        <div key={item} className="rounded-sm bg-navy px-4 py-3 font-mono text-sm text-signal">
          {item}
        </div>
      ))}
    </div>
  );
}

function StrategyBlocks({ items }: { items: string[] }) {
  const primary = items.slice(0, 3);
  const rest = items.slice(3);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {primary.map((item, i) => (
          <div key={item} className="rounded-sm bg-navy/90 p-5">
            <span className="font-hand text-3xl text-signal">{i + 1}</span>
            <p className="mt-2 font-display text-sm font-semibold uppercase tracking-wide text-paper">
              {item}
            </p>
          </div>
        ))}
      </div>
      {rest.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-90">
          {rest.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function ProblemNote({ items }: { items: string[] }) {
  return (
    <StickyNote rotate="-1deg" className="w-full max-w-sm text-sm">
      <span className="font-note text-blue">The problem —</span>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </StickyNote>
  );
}

export default function CaseStudyCard({ study }: { study: CaseStudy }) {
  const isBlue = study.theme === "blue";
  const isCream = study.theme === "cream";
  const isSplit = study.theme === "split";

  const sectionBg = isBlue
    ? "bg-gradient-to-br from-blue to-deep-blue text-paper"
    : isCream
      ? "bg-cream text-navy"
      : "bg-navy text-paper";

  const mutedText = isCream ? "text-muted-ink" : "text-paper/80";
  const eyebrowColor = isCream ? "text-blue" : "text-signal";
  const pipelineTone = isCream ? "on-light" : "on-dark";

  return (
    <div id={study.slug} className={`relative overflow-hidden px-6 py-24 ${sectionBg}`}>
      {isSplit && (
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-br from-blue to-deep-blue" />
      )}

      <div className="relative mx-auto max-w-5xl">
        <div className="flex items-center gap-4">
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full border-2 font-hand text-3xl font-bold ${
              isCream ? "border-blue text-blue" : "border-signal text-signal"
            }`}
          >
            {study.index.replace(/^0/, "")}
          </span>
          <p className={`font-mono text-xs uppercase tracking-[0.2em] ${eyebrowColor}`}>
            {study.tags.slice(0, 4).join(" · ")}
          </p>
        </div>

        <h3 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          {study.title}
        </h3>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <ProblemNote items={study.problem} />
          <div className="lg:max-w-md">
            <h4 className={`font-mono text-xs uppercase tracking-wider ${eyebrowColor}`}>
              Architecture
            </h4>
            <div className="mt-3">
              <Pipeline stages={study.architecture} tone={pipelineTone} />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h4 className={`font-mono text-xs uppercase tracking-wider ${eyebrowColor}`}>
            Strategy
          </h4>
          <div className="mt-4">
            <StrategyBlocks items={study.decisions} />
          </div>
        </div>

        <div className="mt-12">
          <h4 className={`font-mono text-xs uppercase tracking-wider ${eyebrowColor}`}>
            Security &amp; reliability controls
          </h4>
          <ul className={`mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm ${mutedText}`}>
            {study.controls.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {study.incidentTimeline && (
          <div className="mt-12 rounded-sm bg-navy p-6 sm:p-8">
            <h4 className="font-mono text-xs uppercase tracking-wider text-signal">
              Incident timeline
            </h4>
            <ol className="mt-4 space-y-1.5 font-mono text-sm text-paper/90">
              {study.incidentTimeline.map((row) => (
                <li key={row.time} className="flex gap-3">
                  <span className="text-signal">{row.time}</span>
                  <span>{row.event}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-12">
          <h4 className={`font-mono text-xs uppercase tracking-wider ${eyebrowColor}`}>Impact</h4>
          <div className="mt-4">
            <ImpactStats impact={study.impact} />
          </div>
        </div>

        <p className={`mt-8 text-xs ${mutedText}`}>
          Architecture diagrams, configs and a demo walkthrough available on request.
        </p>
      </div>
    </div>
  );
}
