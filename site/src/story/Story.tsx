import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, ensureGsapRegistered, prefersReducedMotion } from "../lib/motion";
import { SCENES, type SceneId } from "./sceneConfig";
import StoryNav from "./StoryNav";
import CoverScene from "./scenes/CoverScene";
import { OriginBioScene, OriginImpactScene, OriginTimelineScene } from "./scenes/OriginScene";
import LineArtScene from "./scenes/LineArtScene";
import ProjectIntroScene, { type ProjectIntroRefId } from "./scenes/ProjectIntroScene";
import BestWorkScene from "./scenes/BestWorkScene";
import BuildLabScene, { type BuildLabRefId } from "./scenes/BuildLabScene";
import ContactScene, { type ContactRefId } from "./scenes/ContactScene";

export default function Story({ active }: { active: boolean }) {
  const sceneRefs = useRef<Record<string, HTMLElement | null>>({});
  const projectIntroRefs = useRef<Record<ProjectIntroRefId, HTMLElement | null>>({
    eyebrow: null,
    headline: null,
    tagline: null,
    stack: null,
    cue: null,
  });
  const buildLabRefs = useRef<Record<BuildLabRefId, HTMLElement | null>>({
    eyebrow: null,
    headline: null,
    featured: null,
    grid: null,
    stack: null,
  });
  const contactRefs = useRef<Record<ContactRefId, HTMLElement | null>>({
    wordmark: null,
    tagline: null,
    cue: null,
    links: null,
    footerBar: null,
    signature: null,
  });
  const [activeIndex, setActiveIndex] = useState(0);

  // Normal page scroll, page-by-page: each scene is a full-height section
  // in regular document flow (no pin, no scrub, no master timeline). CSS
  // scroll-snap gives the "one scroll = one page" feel; each section plays
  // its own reveal-on-enter animation the first time it crosses into view,
  // driven by its own ScrollTrigger instead of a shared scrubbed timeline.
  useEffect(() => {
    if (!active) return;
    ensureGsapRegistered();
    const reduced = prefersReducedMotion();

    document.documentElement.style.scrollSnapType = reduced ? "" : "y mandatory";

    const ctx = gsap.context(() => {
      SCENES.forEach((s, i) => {
        const el = sceneRefs.current[s.id];
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => self.isActive && setActiveIndex(i),
        });

        if (s.id === "cover") return; // Cover animates itself on `active`.

        if (reduced) {
          // Content stays visible as-is; only the reveal tweens are skipped.
          return;
        }

        if (s.id === "projectIntro") {
          const r = projectIntroRefs.current;
          gsap.set([r.eyebrow, r.headline, r.tagline, r.stack, r.cue], { autoAlpha: 0, y: 16 });
          gsap
            .timeline({
              scrollTrigger: { trigger: el, start: "top 65%", toggleActions: "play none none reverse" },
            })
            .to(r.eyebrow, { autoAlpha: 1, y: 0, duration: 0.25 }, 0)
            .to(r.headline, { autoAlpha: 1, y: 0, duration: 0.38 }, 0.08)
            .to(r.tagline, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.28)
            .to(r.stack, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.4)
            .to(r.cue, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.52);
        } else if (s.id === "buildLab") {
          const r = buildLabRefs.current;
          gsap.set([r.eyebrow, r.headline, r.featured, r.grid, r.stack], { autoAlpha: 0, y: 16 });
          gsap
            .timeline({
              scrollTrigger: { trigger: el, start: "top 65%", toggleActions: "play none none reverse" },
            })
            .to(r.eyebrow, { autoAlpha: 1, y: 0, duration: 0.28 }, 0)
            .to(r.headline, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.08)
            .to(r.featured, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.25)
            .to(r.grid, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.42)
            .to(r.stack, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.56);
        } else if (s.id === "contact") {
          const r = contactRefs.current;
          gsap.set(r.wordmark, { autoAlpha: 0, scale: 0.85 });
          gsap.set([r.tagline, r.cue, r.links], { autoAlpha: 0, y: 12 });
          gsap.set(r.footerBar, { autoAlpha: 0, y: 24 });
          gsap.set(r.signature, { autoAlpha: 0, scale: 0.85 });
          gsap
            .timeline({
              scrollTrigger: { trigger: el, start: "top 65%", toggleActions: "play none none reverse" },
            })
            .to(r.wordmark, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" }, 0)
            .to(r.tagline, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.4)
            .to(r.cue, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.55)
            .to(r.links, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.68)
            .to(r.footerBar, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.85)
            .to(r.signature, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.8)" }, 1.05);
        } else {
          // Generic whole-scene reveal for every other page (Origin's 3
          // beats, LineArt, each Best Work project).
          gsap.set(el, { autoAlpha: 0, y: 32 });
          gsap.to(el, {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none reverse" },
          });
        }
      });
    });

    return () => {
      ctx.revert();
      document.documentElement.style.scrollSnapType = "";
    };
  }, [active]);

  const jumpTo = (id: SceneId) => {
    sceneRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative">
      {SCENES.map((s) => (
        <section
          key={s.id}
          ref={(el) => (sceneRefs.current[s.id] = el)}
          className="relative flex h-screen w-full snap-start items-center justify-center overflow-hidden pt-14 pb-20"
        >
          {s.id === "cover" ? (
            <CoverScene active={active} />
          ) : s.id === "originBio" ? (
            <OriginBioScene />
          ) : s.id === "originImpact" ? (
            <OriginImpactScene />
          ) : s.id === "originTimeline" ? (
            <OriginTimelineScene />
          ) : s.id === "lineArt" ? (
            <LineArtScene />
          ) : s.id === "projectIntro" ? (
            <ProjectIntroScene registerRef={(id, el) => (projectIntroRefs.current[id] = el)} />
          ) : s.id === "bestWork0" ? (
            <BestWorkScene index={0} />
          ) : s.id === "bestWork1" ? (
            <BestWorkScene index={1} />
          ) : s.id === "bestWork2" ? (
            <BestWorkScene index={2} />
          ) : s.id === "buildLab" ? (
            <BuildLabScene registerRef={(id, el) => (buildLabRefs.current[id] = el)} />
          ) : s.id === "contact" ? (
            <ContactScene registerRef={(id, el) => (contactRefs.current[id] = el)} />
          ) : null}
        </section>
      ))}

      <StoryNav activeId={SCENES[activeIndex].id} onJump={jumpTo} />
    </div>
  );
}
