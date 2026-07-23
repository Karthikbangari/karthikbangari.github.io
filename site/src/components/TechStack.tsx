import { useEffect, useRef } from "react";
import { skillGroups } from "../data/skills";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "../lib/motion";

export default function TechStack() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(dotRef.current, { top: "0%" });
      gsap.to(dotRef.current, {
        top: "100%",
        ease: "none",
        scrollTrigger: { trigger: wrapRef.current, start: "top 70%", end: "bottom 70%", scrub: 0.5 },
      });

      groupRefs.current.forEach((el) => {
        gsap.set(el, { autoAlpha: 0, y: 24 });
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" className="relative overflow-hidden bg-cream px-6 py-24 text-navy">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue">Technology Stack</p>
      <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold sm:text-5xl">
        The engineering toolbox, not a logo wall.
      </h2>

      <div ref={wrapRef} className="relative mx-auto mt-14 max-w-5xl divide-y divide-navy/10 border-y border-navy/10">
        <div
          ref={dotRef}
          aria-hidden="true"
          className="absolute -left-3 h-2 w-2 -translate-x-1/2 rounded-full bg-signal shadow-[0_0_8px_2px_rgba(201,255,61,0.5)] sm:-left-4"
        />
        {skillGroups.map((group, i) => (
          <div
            key={group.group}
            ref={(el) => (groupRefs.current[i] = el)}
            className="flex flex-col gap-4 py-8 sm:flex-row sm:gap-10"
          >
            <h3 className="w-full shrink-0 font-hand text-3xl text-blue sm:w-48">
              {group.group}
            </h3>
            <ul className="grid flex-1 grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {group.skills.map((skill) => (
                <li key={skill.name}>
                  <div className="font-mono text-sm font-semibold text-navy">{skill.name}</div>
                  <p className="mt-0.5 text-xs text-muted-ink">{skill.example}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
