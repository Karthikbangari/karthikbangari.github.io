import { useEffect, useRef } from "react";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "../lib/motion";

export default function PaperSceneTransition() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(leftRef.current, { yPercent: 110, rotate: -8 });
      gsap.set(rightRef.current, { yPercent: 110, rotate: 8 });

      gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 0.6,
        },
      })
        .to(leftRef.current, { yPercent: 0, rotate: -1, ease: "none" }, 0)
        .to(rightRef.current, { yPercent: 0, rotate: 1, ease: "none" }, 0);
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className="relative h-[38vh] overflow-hidden bg-blue">
      <div ref={leftRef} className="absolute inset-x-0 top-0 h-1/2 origin-bottom bg-cream" />
      <div ref={rightRef} className="absolute inset-x-0 bottom-0 h-1/2 origin-top bg-cream" />
    </div>
  );
}
