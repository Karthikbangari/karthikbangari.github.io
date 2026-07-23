import { useEffect, useRef } from "react";
import { metrics, secondaryMetrics } from "../data/metrics";
import { useInView } from "../hooks/useInView";
import MetricCard from "./MetricCard";
import HandDrawnArrow from "./HandDrawnArrow";
import { gsap, ScrollTrigger, ensureGsapRegistered, prefersReducedMotion } from "../lib/motion";

const ROTATIONS = ["-3deg", "2deg", "-2deg", "3deg", "-1.5deg"];
const ENTRY_FROM = [
  { x: -140, y: 0, rotate: -10 },
  { x: 140, y: 0, rotate: 10 },
  { x: -100, y: 60, rotate: -8 },
  { x: 100, y: 60, rotate: 8 },
  { x: 0, y: 120, rotate: 6 },
];

export default function ImpactDashboard() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [heroMetric, ...rest] = metrics;

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const secondaryRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(eyebrowRef.current, { autoAlpha: 0, y: -10 });
      gsap.set(headingRef.current, { autoAlpha: 0, y: 16 });
      gsap.set(heroCardRef.current, { autoAlpha: 0, y: -50, rotate: -6 });
      gsap.set(arrowRef.current, { autoAlpha: 0, scale: 0.6 });
      cardRefs.current.forEach((el, i) => {
        gsap.set(el, { autoAlpha: 0, x: ENTRY_FROM[i].x, y: ENTRY_FROM[i].y, rotate: ENTRY_FROM[i].rotate });
      });
      gsap.set(secondaryRef.current, { autoAlpha: 0, y: 16 });

      const build = () => {
        const tl = gsap.timeline();
        tl.to(eyebrowRef.current, { autoAlpha: 1, y: 0, duration: 0.3 }, 0)
          .to(headingRef.current, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.1)
          .to(
            heroCardRef.current,
            { autoAlpha: 1, y: 0, rotate: 0, duration: 0.4, ease: "back.out(1.7)" },
            0.25,
          )
          .to(arrowRef.current, { autoAlpha: 1, scale: 1, duration: 0.25 }, 0.5);

        // Each MetricCard already applies its own static final rotation via
        // its `rotate` prop — the wrapper only animates the entry offset back
        // to 0, so the two don't compound into double rotation.
        cardRefs.current.forEach((el, i) => {
          tl.to(
            el,
            { autoAlpha: 1, x: 0, y: 0, rotate: 0, duration: 0.4, ease: "back.out(1.5)" },
            0.55 + i * 0.12,
          );
        });

        tl.to(secondaryRef.current, { autoAlpha: 1, y: 0, duration: 0.3 }, 1.3);
        return tl;
      };

      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          if (!sectionRef.current) return;
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "+=140%",
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            animation: build(),
            toggleActions: "play none none reverse",
          });
        },
        "(max-width: 767px)": () => {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 70%",
            animation: build(),
            once: true,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="impact"
      className="relative overflow-hidden bg-cream px-6 py-24 text-navy"
    >
      <p ref={eyebrowRef} className="font-mono text-xs uppercase tracking-[0.2em] text-blue">
        Production impact
      </p>
      <h2 ref={headingRef} className="mt-3 max-w-2xl font-display text-4xl font-bold sm:text-5xl">
        Measurable, not marketing.
      </h2>

      <div ref={ref} className="relative mx-auto mt-14 max-w-5xl">
        <div ref={heroCardRef} className="flex justify-center">
          <MetricCard metric={heroMetric} inView={inView} big />
        </div>

        <div ref={arrowRef} className="mx-auto -my-4 hidden h-16 w-24 sm:block">
          <HandDrawnArrow color="#173DE5" className="pointer-events-none h-16 w-24" />
        </div>

        <div className="mt-6 flex flex-wrap items-start justify-center gap-6">
          {rest.map((metric, i) => (
            <div key={metric.label} ref={(el) => (cardRefs.current[i] = el)}>
              <MetricCard metric={metric} inView={inView} rotate={ROTATIONS[i % ROTATIONS.length]} />
            </div>
          ))}
        </div>
      </div>

      <ul
        ref={secondaryRef}
        className="relative mx-auto mt-16 flex max-w-4xl flex-wrap justify-center gap-x-10 gap-y-3 font-note text-xl text-blue"
      >
        {secondaryMetrics.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
