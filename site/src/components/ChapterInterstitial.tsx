import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "../lib/motion";

export default function ChapterInterstitial({
  chapter,
  lines,
  next,
}: {
  chapter: string;
  lines: string[];
  next: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(
        lineRefs.current.map((el) => el?.firstElementChild),
        { yPercent: 100 },
      );
      gsap.set(metaRef.current, { autoAlpha: 0, y: 10 });

      gsap
        .timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true } })
        .to(
          lineRefs.current.map((el) => el?.firstElementChild),
          { yPercent: 0, duration: 0.5, stagger: 0.12, ease: "power4.out" },
          0,
        )
        .to(metaRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.4);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[70vh] flex-col items-center justify-center gap-8 bg-gradient-to-br from-blue to-deep-blue px-6 py-20 text-center text-paper"
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
        Chapter {chapter}
      </p>

      <h2 className="font-display text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
        {lines.map((line) => (
          <div key={line} ref={(el) => (lineRefs.current[lines.indexOf(line)] = el)} className="overflow-hidden">
            <div>{line}</div>
          </div>
        ))}
      </h2>

      <div ref={metaRef} className="flex flex-col items-center gap-3">
        <div className="h-px w-16 bg-paper/30" />
        <p className="font-mono text-xs uppercase tracking-wider text-paper/70">Next — {next}</p>
        <ArrowDown size={18} className="text-signal" />
      </div>
    </section>
  );
}
