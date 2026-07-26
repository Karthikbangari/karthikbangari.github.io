import { useEffect, useRef } from "react";
import { Github, Linkedin, ArrowRight, FileDown } from "lucide-react";
import { profile } from "../../data/profile";
import { links } from "../../data/links";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "../../lib/motion";

export default function CoverScene({ active }: { active: boolean }) {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);
  const availRef = useRef<HTMLParagraphElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLParagraphElement>(null);

  // Assembly animation — runs once when the preloader hands off, same
  // pattern as the fallback site's Hero (see components/Hero.tsx).
  useEffect(() => {
    if (!active) return;
    ensureGsapRegistered();

    const els = [
      eyebrowRef.current,
      headlineRef.current,
      subheadRef.current,
      badgesRef.current,
      ctaRowRef.current,
      availRef.current,
      wordmarkRef.current,
      photoWrapRef.current,
      scrollCueRef.current,
    ];

    if (prefersReducedMotion()) {
      gsap.set(els, { clearProps: "all" });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set(eyebrowRef.current, { autoAlpha: 0, y: -12 });
    gsap.set(headlineRef.current, { autoAlpha: 0, y: 24 });
    gsap.set([subheadRef.current, badgesRef.current, ctaRowRef.current, availRef.current], {
      autoAlpha: 0,
      y: 16,
    });
    gsap.set(wordmarkRef.current, { autoAlpha: 0 });
    gsap.set(photoWrapRef.current, { autoAlpha: 0, scale: 0.82, rotate: -6, y: 30 });
    gsap.set(scrollCueRef.current, { autoAlpha: 0, y: 10 });

    tl.to(eyebrowRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, 0)
      .to(headlineRef.current, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.1)
      .to(wordmarkRef.current, { autoAlpha: 1, duration: 0.6 }, 0.25)
      .to(
        photoWrapRef.current,
        { autoAlpha: 1, scale: 1.03, rotate: 0, y: 0, duration: 0.7, ease: "back.out(1.6)" },
        0.3,
      )
      .to(photoWrapRef.current, { scale: 1, duration: 0.25 }, "-=0.15")
      .to(subheadRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.45)
      .to(badgesRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.6)
      .to(ctaRowRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.7)
      .to(availRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.8)
      .to(scrollCueRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.95);

    return () => {
      tl.kill();
    };
  }, [active]);

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue to-deep-blue px-10 text-paper">
      <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p ref={eyebrowRef} className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            {profile.eyebrow}
          </p>
          <h1
            ref={headlineRef}
            className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            {profile.headline}
          </h1>
          <p ref={subheadRef} className="mt-5 max-w-lg text-sm text-paper/90 sm:text-base">
            {profile.subhead}
          </p>

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

        <div className="relative hidden items-center justify-center lg:flex">
          <span
            ref={wordmarkRef}
            aria-hidden="true"
            className="pointer-events-none select-none whitespace-nowrap font-hand text-[9rem] leading-none text-paper/15"
          >
            karthik
          </span>
          <div
            ref={photoWrapRef}
            className="absolute h-52 w-52 overflow-hidden rounded-full border-4 border-paper/40 shadow-[0_25px_70px_rgba(0,0,0,0.4)]"
          >
            <img
              src={profile.photo}
              alt="Karthik Bangari"
              className="h-full w-full object-cover grayscale contrast-125"
            />
            <div className="pointer-events-none absolute inset-0 bg-blue mix-blend-color" />
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