import { useEffect, useRef } from "react";
import type { CaseStudy } from "../data/projects";
import StickyNote from "./StickyNote";
import IncidentLineDraw from "./IncidentLineDraw";
import ModuleTree from "./ModuleTree";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "../lib/motion";

function useRevealOnEnter<T extends HTMLElement>(
  build: (el: T) => void,
  start = "top 85%",
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion() || !ref.current) return;

    const ctx = gsap.context(() => {
      if (!ref.current) return;
      ScrollTriggerBuild(ref.current, start, () => build(ref.current!));
    }, ref);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

function ScrollTriggerBuild(el: HTMLElement, start: string, run: () => void) {
  gsap.timeline({ scrollTrigger: { trigger: el, start, once: true } }).add(run);
}

function Pipeline({ stages, tone }: { stages: string[]; tone: "on-dark" | "on-light" }) {
  const chip =
    tone === "on-dark"
      ? "border-paper/30 text-paper"
      : "border-navy/20 text-navy bg-paper";
  const arrow = tone === "on-dark" ? "text-signal" : "text-blue";
  const hint = tone === "on-dark" ? "text-paper/60" : "text-muted-ink";

  const wrapRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(chipRefs.current, { autoAlpha: 0, scale: 0.85 });
      gsap.set(dotRef.current, { autoAlpha: 0, left: "0%" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrapRef.current, start: "top 85%", once: true },
      });

      tl.to(dotRef.current, { autoAlpha: 1, duration: 0.1 }, 0).to(
        dotRef.current,
        { left: "97%", duration: stages.length * 0.25, ease: "none" },
        0,
      );

      chipRefs.current.forEach((el, i) => {
        tl.to(el, { autoAlpha: 1, scale: 1, duration: 0.25 }, i * 0.25);
      });
    }, wrapRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrapRef}>
      <div className="overflow-x-auto">
        <div className="relative flex min-w-max items-center gap-2 pt-3 font-mono text-xs">
          <div
            ref={dotRef}
            aria-hidden="true"
            className="absolute top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-signal shadow-[0_0_8px_2px_rgba(201,255,61,0.6)]"
          />
          {stages.map((stage, i) => (
            <span key={stage} className="flex items-center gap-2 whitespace-nowrap">
              <span
                ref={(el) => (chipRefs.current[i] = el)}
                className={`rounded border px-2 py-1 ${chip}`}
              >
                {stage}
              </span>
              {i < stages.length - 1 && <span className={arrow}>→</span>}
            </span>
          ))}
        </div>
      </div>
      <p className={`mt-1 font-mono text-[10px] ${hint} sm:hidden`}>⇄ scroll to see the full pipeline</p>
    </div>
  );
}

function ImpactStats({ impact }: { impact: string[] }) {
  const ref = useRevealOnEnter<HTMLDivElement>((el) => {
    const items = Array.from(el.children) as HTMLElement[];
    gsap.set(items, { autoAlpha: 0, scale: 0.7, y: 10 });
    gsap
      .timeline()
      .to(items, { autoAlpha: 1, scale: 1, y: 0, duration: 0.3, stagger: 0.1, ease: "back.out(2)" });
  });

  return (
    <div ref={ref} className="flex flex-wrap gap-3">
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
  const ref = useRevealOnEnter<HTMLDivElement>((el) => {
    const blocks = Array.from(el.querySelectorAll("[data-strategy-block]")) as HTMLElement[];
    gsap.set(blocks, { autoAlpha: 0, y: 40 });
    gsap.timeline().to(blocks, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.15, ease: "power3.out" });
  });

  return (
    <div ref={ref}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {primary.map((item, i) => (
          <div key={item} data-strategy-block className="rounded-sm bg-navy/90 p-5">
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
    </div>
  );
}

function ProblemNote({ items }: { items: string[] }) {
  const ref = useRevealOnEnter<HTMLDivElement>((el) => {
    gsap.set(el, { autoAlpha: 0, y: -40, rotate: -12 });
    gsap.timeline().to(el, { autoAlpha: 1, y: 0, rotate: -1, duration: 0.5, ease: "back.out(1.6)" });
  });

  return (
    <div ref={ref}>
      <StickyNote rotate="-1deg" className="w-full max-w-sm text-sm">
        <span className="font-note text-blue">The problem —</span>
        <ul className="mt-2 space-y-1">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </StickyNote>
    </div>
  );
}

function ControlsList({ items, className }: { items: string[]; className: string }) {
  const ref = useRevealOnEnter<HTMLUListElement>((el) => {
    const rows = Array.from(el.children) as HTMLElement[];
    gsap.set(rows, { autoAlpha: 0, x: -12 });
    gsap.timeline().to(rows, { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.1 });
  });

  return (
    <ul ref={ref} className={className}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {item}
        </li>
      ))}
    </ul>
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

  const badgeRef = useRevealOnEnter<HTMLDivElement>((el) => {
    gsap.set(el, { autoAlpha: 0, y: -12 });
    gsap.timeline().to(el, { autoAlpha: 1, y: 0, duration: 0.4 });
  }, "top 90%");

  const headlineWrapRef = useRevealOnEnter<HTMLDivElement>((el) => {
    const h = el.firstElementChild as HTMLElement;
    gsap.set(h, { yPercent: 100 });
    gsap.timeline().to(h, { yPercent: 0, duration: 0.6, ease: "power4.out" });
  }, "top 88%");

  return (
    <div id={study.slug} className={`relative overflow-hidden px-6 py-24 ${sectionBg}`}>
      {isSplit && (
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-br from-blue to-deep-blue" />
      )}

      <div className="relative mx-auto max-w-5xl">
        <div ref={badgeRef} className="flex items-center gap-4">
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

        <div ref={headlineWrapRef} className="mt-6 max-w-3xl overflow-hidden">
          <h3 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {study.title}
          </h3>
        </div>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <ProblemNote items={study.problem} />
          <div className="lg:max-w-md">
            <h4 className={`font-mono text-xs uppercase tracking-wider ${eyebrowColor}`}>
              Architecture
            </h4>
            <div className="mt-3">
              <Pipeline stages={study.architecture} tone={pipelineTone} />
            </div>
            {study.slug === "terraform-aws-platform" && <ModuleTree />}
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
          <ControlsList
            items={study.controls}
            className={`mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm ${mutedText}`}
          />
        </div>

        {study.incidentTimeline && (
          <div className="mt-12">
            <h4 className={`font-mono text-xs uppercase tracking-wider ${eyebrowColor}`}>
              Incident timeline
            </h4>
            <div className="mt-4">
              <IncidentLineDraw timeline={study.incidentTimeline} />
            </div>
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
