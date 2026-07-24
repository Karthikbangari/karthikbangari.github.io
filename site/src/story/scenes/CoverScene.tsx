import { useEffect, useRef } from "react";
import { Github, Linkedin, ArrowRight, FileDown } from "lucide-react";
import { profile } from "../../data/profile";
import { links } from "../../data/links";
import StickyNote from "../../components/StickyNote";
import HandDrawnArrow from "../../components/HandDrawnArrow";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "../../lib/motion";

const MICRO_STORY = [
  { label: "Started as", value: "Junior DevOps Engineer" },
  { label: "Became", value: "DevOps Engineer" },
  { label: "Building toward", value: "Platform / SRE Engineering" },
];

function ReliabilityGraph({
  pathRef,
  dotRef,
}: {
  pathRef: React.RefObject<SVGPolylineElement>;
  dotRef: React.RefObject<SVGCircleElement>;
}) {
  return (
    <svg viewBox="0 0 160 60" className="h-12 w-40" aria-hidden="true">
      <polyline
        ref={pathRef}
        points="4,52 30,44 52,48 76,28 100,32 124,12 156,6"
        fill="none"
        stroke="#C8FF22"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle ref={dotRef} cx="156" cy="6" r="4" fill="#C8FF22" />
    </svg>
  );
}

export default function CoverScene({ active }: { active: boolean }) {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const noteWrapRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const microRowRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);
  const availRef = useRef<HTMLParagraphElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);
  const tapeLabelRef = useRef<HTMLDivElement>(null);
  const graphWrapRef = useRef<HTMLDivElement>(null);
  const graphPathRef = useRef<SVGPolylineElement>(null);
  const graphDotRef = useRef<SVGCircleElement>(null);
  const scrollCueRef = useRef<HTMLParagraphElement>(null);

  // Assembly animation — runs once when the preloader hands off. Mixes the
  // fuller fallback-site Hero.tsx treatment (micro-story career arc, sticky
  // note, reliability graph, tape label) back into Story mode's cover,
  // and paces it noticeably slower/more deliberate than the original
  // simplified Story cut.
  useEffect(() => {
    if (!active) return;
    ensureGsapRegistered();

    const els = [
      eyebrowRef.current,
      noteWrapRef.current,
      headlineRef.current,
      subheadRef.current,
      microRowRef.current,
      badgesRef.current,
      ctaRowRef.current,
      availRef.current,
      wordmarkRef.current,
      photoWrapRef.current,
      tapeLabelRef.current,
      graphWrapRef.current,
      scrollCueRef.current,
    ];

    if (prefersReducedMotion()) {
      gsap.set(els, { clearProps: "all" });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set(eyebrowRef.current, { autoAlpha: 0, y: -12 });
    gsap.set(noteWrapRef.current, { autoAlpha: 0, y: -20, rotate: -8 });
    gsap.set(headlineRef.current, { autoAlpha: 0, y: 24 });
    gsap.set(
      [subheadRef.current, microRowRef.current, badgesRef.current, ctaRowRef.current, availRef.current],
      { autoAlpha: 0, y: 16 },
    );
    gsap.set(wordmarkRef.current, { autoAlpha: 0 });
    gsap.set(photoWrapRef.current, { autoAlpha: 0, scale: 0.82, rotate: -6, y: 30 });
    gsap.set(tapeLabelRef.current, { autoAlpha: 0, y: 14, rotate: 6 });
    gsap.set(graphWrapRef.current, { autoAlpha: 0, y: 16 });
    if (graphPathRef.current) {
      const len = graphPathRef.current.getTotalLength();
      gsap.set(graphPathRef.current, { strokeDasharray: len, strokeDashoffset: len });
    }
    gsap.set(graphDotRef.current, { autoAlpha: 0 });
    gsap.set(scrollCueRef.current, { autoAlpha: 0, y: 10 });

    // Slower, more deliberate than the original cut (~1.35s total) — closer
    // to Hero.tsx's own ~2.3s assembly pacing, per the "make it a little
    // slow" note.
    tl.to(eyebrowRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, 0)
      .to(headlineRef.current, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power4.out" }, 0.2)
      .to(wordmarkRef.current, { autoAlpha: 1, duration: 0.8 }, 0.4)
      .to(
        photoWrapRef.current,
        { autoAlpha: 1, scale: 1.03, rotate: 0, y: 0, duration: 0.9, ease: "back.out(1.6)" },
        0.45,
      )
      .to(photoWrapRef.current, { scale: 1, duration: 0.3 }, "-=0.2")
      .to(subheadRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.65)
      .to(noteWrapRef.current, { autoAlpha: 1, y: 0, rotate: 3, duration: 0.6, ease: "back.out(2)" }, 0.75)
      .to(microRowRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.9)
      .to(badgesRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.05)
      .to(ctaRowRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.2)
      .to(availRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.35)
      .to(tapeLabelRef.current, { autoAlpha: 1, y: 0, rotate: -2, duration: 0.5 }, 1.3)
      .to(graphWrapRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.4)
      .to(graphPathRef.current, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 1.4)
      .to(graphDotRef.current, { autoAlpha: 1, duration: 0.25 }, 2.25)
      .to(scrollCueRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, 2.4);

    return () => {
      tl.kill();
    };
  }, [active]);

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue to-deep-blue px-10 text-paper">
      <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="flex items-start justify-between gap-4">
            <p ref={eyebrowRef} className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
              {profile.eyebrow}
            </p>
            <div ref={noteWrapRef} className="relative hidden shrink-0 lg:block">
              <HandDrawnArrow
                color="#FFFDF7"
                flip
                className="pointer-events-none absolute -bottom-10 -left-16 h-14 w-20 rotate-[100deg]"
              />
              <StickyNote rotate="3deg" className="w-48 text-xs">
                Fastest way to know me → Best Work
              </StickyNote>
            </div>
          </div>

          <h1
            ref={headlineRef}
            className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            {profile.headline}
          </h1>
          <p ref={subheadRef} className="mt-5 max-w-lg text-sm text-paper/90 sm:text-base">
            {profile.subhead}
          </p>

          <div
            ref={microRowRef}
            className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-y border-paper/20 py-4"
          >
            {MICRO_STORY.map((step) => (
              <div key={step.label}>
                <p className="font-mono text-[11px] uppercase tracking-wider text-paper/70">
                  {step.label}
                </p>
                <p className="font-display text-base font-semibold text-paper sm:text-lg">
                  {step.value}
                </p>
              </div>
            ))}
          </div>

          <div ref={badgesRef} className="mt-6 flex flex-wrap gap-2">
            {profile.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-paper/30 px-3 py-1 font-mono text-xs text-paper"
              >
                {badge}
              </span>
            ))}
          </div>

          <div ref={ctaRowRef} className="mt-7 flex flex-wrap items-center gap-4">
            <a
              href="#bestWork"
              className="flex items-center gap-2 rounded-full bg-signal px-5 py-3 font-mono text-sm font-semibold text-navy"
            >
              View Best Work
              <ArrowRight size={16} />
            </a>
            <a
              href={links.resume}
              className="flex items-center gap-2 rounded-full border border-paper/40 px-5 py-3 font-mono text-sm font-medium text-paper"
            >
              <FileDown size={16} />
              Download Resume
            </a>
            <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-paper/80">
              <Github size={20} />
            </a>
            <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-paper/80">
              <Linkedin size={20} />
            </a>
          </div>

          <p ref={availRef} className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-signal">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            {profile.availability}
          </p>
        </div>

        <div className="relative hidden flex-col items-center justify-center gap-4 lg:flex">
          <div className="relative flex items-center justify-center">
            <span
              ref={wordmarkRef}
              aria-hidden="true"
              className="pointer-events-none absolute select-none whitespace-nowrap font-hand text-[9rem] leading-none text-paper/15"
            >
              karthik
            </span>
            <div
              ref={photoWrapRef}
              className="relative h-52 w-52 overflow-hidden rounded-full border-4 border-paper/40 shadow-[0_25px_70px_rgba(0,0,0,0.4)]"
            >
              <img
                src={profile.photo}
                alt="Karthik Bangari"
                className="h-full w-full object-cover grayscale contrast-125"
              />
              <div className="pointer-events-none absolute inset-0 bg-blue mix-blend-color" />
            </div>
          </div>

          <div ref={graphWrapRef} className="flex flex-col items-center gap-1">
            <ReliabilityGraph pathRef={graphPathRef} dotRef={graphDotRef} />
            <p className="font-mono text-[11px] tracking-wide text-paper/70">
              AWS · Kubernetes · Terraform · GitOps
            </p>
          </div>

          <div
            ref={tapeLabelRef}
            className="-rotate-2 rounded-sm bg-cream px-4 py-2 font-note text-sm text-navy shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
          >
            Portfolio // Karthik Bangari
          </div>
        </div>
      </div>

      <p
        ref={scrollCueRef}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-widest text-paper/50"
      >
        Scroll to begin ↓
      </p>
    </div>
  );
}
