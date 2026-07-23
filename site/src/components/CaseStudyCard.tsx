import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CaseStudy } from "../data/projects";

function Pipeline({ stages }: { stages: string[] }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-2 font-mono text-xs text-muted">
        {stages.map((stage, i) => (
          <span key={stage} className="flex items-center gap-2 whitespace-nowrap">
            <span className="rounded border border-white/15 px-2 py-1">{stage}</span>
            {i < stages.length - 1 && <span className="text-blue-light">→</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-sm text-muted">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="text-signal">›</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PlaceholderNote({ children }: { children: string }) {
  return (
    <div className="rounded-lg border border-dashed border-white/20 px-4 py-3 font-mono text-xs text-muted">
      {children}
    </div>
  );
}

export default function CaseStudyCard({ study }: { study: CaseStudy }) {
  const [open, setOpen] = useState(false);
  const panelId = `case-study-${study.slug}`;

  return (
    <div className="relative rounded-2xl border border-white/10 bg-surface/60">
      <span
        aria-hidden="true"
        className="absolute -left-4 -top-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-signal bg-navy font-hand text-xl font-bold text-signal sm:-left-5 sm:-top-5 sm:h-12 sm:w-12 sm:text-2xl"
      >
        {study.index.replace(/^0/, "")}
      </span>

      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 pl-6 font-mono text-xs text-signal sm:pl-8">
          <span className="text-muted">
            {study.tags.slice(0, 3).join(" · ")}
            {study.tags.length > 3 ? " · …" : ""}
          </span>
        </div>

        <h3 className="mt-3 font-display text-2xl font-bold text-paper sm:text-3xl">
          {study.title}
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {study.impact.slice(0, 2).map((item) => (
            <span
              key={item}
              className="rounded-full border border-signal/30 px-3 py-1 font-mono text-xs text-signal"
            >
              {item}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="mt-6 flex items-center gap-1.5 font-mono text-sm text-blue-light hover:text-signal transition-colors"
        >
          {open ? "Hide details" : "View details"}
          <ChevronDown
            size={16}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div id={panelId} className="space-y-8 border-t border-white/10 px-6 py-8 sm:px-8">
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted">
              The production problem
            </h4>
            <div className="mt-3">
              <BulletList items={study.problem} />
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted">Architecture</h4>
            <div className="mt-3">
              <Pipeline stages={study.architecture} />
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted">
              Engineering decisions
            </h4>
            <div className="mt-3">
              <BulletList items={study.decisions} />
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted">
              Security &amp; reliability controls
            </h4>
            <div className="mt-3">
              <BulletList items={study.controls} />
            </div>
          </div>

          {study.incidentTimeline && (
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-muted">
                Incident timeline
              </h4>
              <ol className="mt-3 space-y-1.5 font-mono text-sm text-muted">
                {study.incidentTimeline.map((row) => (
                  <li key={row.time} className="flex gap-3">
                    <span className="text-blue-light">{row.time}</span>
                    <span>{row.event}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted">
              Measured impact
            </h4>
            <div className="mt-3">
              <BulletList items={study.impact} />
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted">Evidence</h4>
            <div className="mt-3">
              <PlaceholderNote>
                Add architecture diagram, screenshots, redacted config samples and a repo/demo
                link once available.
              </PlaceholderNote>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted">
              What I'd improve next
            </h4>
            <div className="mt-3">
              <PlaceholderNote>Add your own 1–2 sentence reflection here.</PlaceholderNote>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
