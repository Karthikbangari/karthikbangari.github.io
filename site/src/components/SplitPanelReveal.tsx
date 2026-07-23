import { useEffect, useRef } from "react";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "../lib/motion";

const PANELS = [
  { label: "BUILD", exit: { x: 0, y: "-110%" } },
  { label: "SHIP", exit: { x: "110%", y: 0 } },
  { label: "RUN", exit: { x: "-110%", y: 0 } },
  { label: "OBSERVE", exit: { x: 0, y: "110%" } },
];

export default function SplitPanelReveal() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      panelRefs.current.forEach((el, i) => {
        tl.to(el, { x: PANELS[i].exit.x, y: PANELS[i].exit.y, ease: "none" }, 0);
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="relative h-screen overflow-hidden bg-navy">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">04 — Build Lab</p>
        <p className="font-display text-3xl font-bold text-paper sm:text-5xl">After Hours</p>
      </div>

      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        {PANELS.map((panel, i) => (
          <div
            key={panel.label}
            ref={(el) => (panelRefs.current[i] = el)}
            className="flex items-center justify-center border border-deep-blue bg-gradient-to-br from-blue to-deep-blue"
          >
            <span className="font-mono text-sm font-semibold tracking-[0.3em] text-paper/80">
              {panel.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
