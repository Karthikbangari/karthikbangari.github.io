import { useRef } from "react";
import { useEffect } from "react";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "../lib/motion";

const PATH =
  "M10,120 L120,112 L200,118 L260,40 L300,70 L340,168 L420,172 L470,150 L560,150 L640,90 L720,78 L790,80";

export default function IncidentLineDraw({
  timeline,
}: {
  timeline: { time: string; event: string }[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (!pathRef.current) return;
      const len = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(labelRefs.current, { autoAlpha: 0, y: 10, rotate: -4 });
      gsap.set(stampRef.current, { autoAlpha: 0, scale: 0.7 });

      const drawDuration = 2.2;

      gsap
        .timeline({ scrollTrigger: { trigger: wrapRef.current, start: "top 75%", once: true } })
        .to(pathRef.current, { strokeDashoffset: 0, duration: drawDuration, ease: "power1.inOut" }, 0)
        .to(
          labelRefs.current,
          {
            autoAlpha: 1,
            y: 0,
            rotate: 0,
            duration: 0.3,
            stagger: drawDuration / Math.max(labelRefs.current.length, 1),
          },
          0,
        )
        .to(stampRef.current, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.8)" }, drawDuration);
    }, wrapRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrapRef} className="relative overflow-hidden rounded-sm bg-black p-6 sm:p-10">
      <svg viewBox="0 0 800 200" className="w-full" aria-hidden="true">
        <path ref={pathRef} d={PATH} fill="none" stroke="#FFFDF7" strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      <div className="relative mt-2 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
        {timeline.map((row, i) => (
          <div key={row.time} ref={(el) => (labelRefs.current[i] = el)} className="font-note text-sm text-signal">
            <div>{row.time}</div>
            <div className="font-mono text-[11px] text-paper/70">{row.event}</div>
          </div>
        ))}
      </div>

      <div
        ref={stampRef}
        className="relative mt-8 flex flex-wrap items-center gap-4 border-t border-paper/10 pt-6"
      >
        <span className="font-mono text-xs text-paper/70">Prometheus</span>
        <span className="font-mono text-xs text-paper/70">Grafana</span>
        <span className="font-mono text-xs text-paper/70">CloudWatch alert</span>
        <span className="ml-auto font-display text-2xl font-bold text-signal">50% lower MTTR</span>
      </div>
    </div>
  );
}
