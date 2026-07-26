import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, ensureGsapRegistered } from "../lib/motion";
import { SCENES, SCENE_WEIGHT, type SceneId } from "./sceneConfig";
import StoryNav from "./StoryNav";
import CoverScene from "./scenes/CoverScene";
import { OriginBioScene, OriginImpactScene, OriginTimelineScene } from "./scenes/OriginScene";
import LineArtScene from "./scenes/LineArtScene";
import ProjectIntroScene, { type ProjectIntroRefId } from "./scenes/ProjectIntroScene";
import BestWorkScene from "./scenes/BestWorkScene";
import BuildLabScene, { type BuildLabRefId } from "./scenes/BuildLabScene";
import ContactScene, { type ContactRefId } from "./scenes/ContactScene";

const PX_PER_WEIGHT = 1400;

export default function Story({ active }: { active: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const gateTopRef = useRef<HTMLDivElement>(null);
  const gateBottomRef = useRef<HTMLDivElement>(null);
  const doorLeftRef = useRef<HTMLDivElement>(null);
  const doorRightRef = useRef<HTMLDivElement>(null);
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
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  // Our own weight-based positions — NOT the same as GSAP's tl.duration(),
  // which is driven by tween end-times and drifts from the weight sum once
  // most of the gap between labels has no tween filling it. jumpTo() must
  // use these, not tl.duration(), or the two units mismatch and scroll
  // targets land in the wrong place (caught via testing: clicking a nav
  // item landed at scrollY 0 instead of that scene's position).
  const labelPositionsRef = useRef<number[]>([]);
  const totalWeightRef = useRef(0);

  const totalTrackPx = useMemo(
    () => SCENES.reduce((sum, s) => sum + SCENE_WEIGHT[s.id] * PX_PER_WEIGHT, 0),
    [],
  );

  const debug = useMemo(
    () => import.meta.env.DEV && new URLSearchParams(window.location.search).has("motionDebug"),
    [],
  );

  useEffect(() => {
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      // Every scene starts stacked, invisible except the first.
      SCENES.forEach((s, i) => {
        const el = sceneRefs.current[s.id];
        gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, zIndex: i === 0 ? 10 : 0 });
      });

      // Cream paper-gate panels used only for the cover -> origin
      // transition — parked off-stage until that segment runs.
      gsap.set(gateTopRef.current, { yPercent: -100 });
      gsap.set(gateBottomRef.current, { yPercent: 100 });

      // Blue center-split "doors" used only for the lineArt -> projectIntro
      // transition — parked off-stage (each door is half the stage width)
      // until that segment runs.
      gsap.set(doorLeftRef.current, { xPercent: -100 });
      gsap.set(doorRightRef.current, { xPercent: 100 });

      gsap.set(
        [
          projectIntroRefs.current.eyebrow,
          projectIntroRefs.current.headline,
          projectIntroRefs.current.tagline,
          projectIntroRefs.current.stack,
          projectIntroRefs.current.cue,
        ],
        { autoAlpha: 0, y: 16 },
      );

      gsap.set(
        [
          buildLabRefs.current.eyebrow,
          buildLabRefs.current.headline,
          buildLabRefs.current.featured,
          buildLabRefs.current.grid,
          buildLabRefs.current.stack,
        ],
        { autoAlpha: 0, y: 16 },
      );

      gsap.set(contactRefs.current.wordmark, { autoAlpha: 0, scale: 0.85 });
      gsap.set(
        [contactRefs.current.tagline, contactRefs.current.cue, contactRefs.current.links],
        { autoAlpha: 0, y: 12 },
      );
      gsap.set(contactRefs.current.footerBar, { autoAlpha: 0, y: 24 });
      gsap.set(contactRefs.current.signature, { autoAlpha: 0, scale: 0.85 });

      // Cumulative label positions, computed once — scenes have different
      // weights, so "which scene is active" must compare against these real
      // positions, not divide progress evenly across SCENES.length.
      const labelPositions: number[] = [];
      {
        let c = 0;
        SCENES.forEach((s) => {
          labelPositions.push(c);
          c += SCENE_WEIGHT[s.id];
        });
        labelPositionsRef.current = labelPositions;
        totalWeightRef.current = c;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: `+=${totalTrackPx}`,
          pin: stageRef.current,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: "labelsDirectional",
            duration: { min: 0.2, max: 0.5 },
            delay: 0.05,
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            const t = self.progress * totalWeightRef.current;
            let idx = 0;
            for (let i = 0; i < labelPositions.length; i++) {
              if (t >= labelPositions[i]) idx = i;
            }
            setActiveIndex(idx);
          },
        },
      });

      let cursor = 0;
      SCENES.forEach((s, i) => {
        const weight = SCENE_WEIGHT[s.id];
        tl.addLabel(s.id, cursor);

        if (i > 0) {
          const prev = SCENES[i - 1];
          const prevEl = sceneRefs.current[prev.id];
          const curEl = sceneRefs.current[s.id];

          if (prev.id === "cover" && s.id === "originBio") {
            // Cover exit (scale down / blur / darken) into a cream
            // paper-gate that closes over the swap and reopens onto
            // Origin — richer than the generic crossfade below, reusing
            // the same cream-panel language as the fallback site's
            // PaperSceneTransition. Starts mid-way through cover's own
            // window so cover still reads as fully settled beforehand.
            const segStart = cursor - 0.5;
            tl.fromTo(
              prevEl,
              { scale: 1, filter: "blur(0px) brightness(1)" },
              { scale: 0.94, filter: "blur(10px) brightness(0.5)", duration: 0.3, ease: "power2.in" },
              segStart,
            )
              .fromTo(
                gateTopRef.current,
                { yPercent: -100, rotate: 0 },
                { yPercent: 0, rotate: -1, duration: 0.25, ease: "power2.inOut" },
                segStart + 0.15,
              )
              .fromTo(
                gateBottomRef.current,
                { yPercent: 100, rotate: 0 },
                { yPercent: 0, rotate: 1, duration: 0.25, ease: "power2.inOut" },
                segStart + 0.15,
              )
              .set(prevEl, { autoAlpha: 0, zIndex: 0 }, segStart + 0.42)
              .set(curEl, { autoAlpha: 1, zIndex: 10 }, segStart + 0.42)
              .to(gateTopRef.current, { yPercent: -100, rotate: 0, duration: 0.3, ease: "power2.inOut" }, segStart + 0.45)
              .to(gateBottomRef.current, { yPercent: 100, rotate: 0, duration: 0.3, ease: "power2.inOut" }, segStart + 0.45);
          } else if (prev.id === "lineArt" && s.id === "projectIntro") {
            // Center-split blue "doors" — confirmed directly on-frame in
            // MOTION_ANALYSIS.md ("two blue panels meet at a centre seam
            // and split apart horizontally"), unlike the paper gate this
            // is a flat, mechanical cut (no rotation) since that's how it
            // reads in the footage. Same enter-from-the-side /
            // exit-back-the-same-side shape as the cream gate, just
            // horizontal instead of vertical.
            const segStart = cursor - 0.2;
            tl.to(doorLeftRef.current, { xPercent: 0, duration: 0.22, ease: "power2.inOut" }, segStart)
              .to(doorRightRef.current, { xPercent: 0, duration: 0.22, ease: "power2.inOut" }, segStart)
              .set(prevEl, { autoAlpha: 0, zIndex: 0 }, segStart + 0.22)
              .set(curEl, { autoAlpha: 1, zIndex: 10 }, segStart + 0.22)
              .to(doorLeftRef.current, { xPercent: -100, duration: 0.28, ease: "power2.inOut" }, segStart + 0.24)
              .to(doorRightRef.current, { xPercent: 100, duration: 0.28, ease: "power2.inOut" }, segStart + 0.24);
          } else {
            // Plain crossfade — the shared transition for every other
            // scene-to-scene handoff, including the split-out Origin beats
            // and Best Work projects, which used to scrub their own
            // internal swap/filmstrip and now are just full pages.
            tl.to(prevEl, { autoAlpha: 0, duration: 0.3 }, cursor)
              .set(prevEl, { zIndex: 0 }, cursor + 0.3)
              .set(curEl, { zIndex: 10 }, cursor)
              .to(curEl, { autoAlpha: 1, duration: 0.3 }, cursor);
          }
        }

        if (s.id === "projectIntro") {
          // Brief title-card entrance, revealed right as the blue doors
          // finish opening onto it.
          const introStart = cursor + weight * 0.05;
          tl.to(projectIntroRefs.current.eyebrow, { autoAlpha: 1, y: 0, duration: 0.25 }, introStart)
            .to(projectIntroRefs.current.headline, { autoAlpha: 1, y: 0, duration: 0.38 }, introStart + 0.08)
            .to(projectIntroRefs.current.tagline, { autoAlpha: 1, y: 0, duration: 0.25 }, introStart + 0.28)
            .to(projectIntroRefs.current.stack, { autoAlpha: 1, y: 0, duration: 0.25 }, introStart + 0.4)
            .to(projectIntroRefs.current.cue, { autoAlpha: 1, y: 0, duration: 0.25 }, introStart + 0.52);
        }

        if (s.id === "buildLab") {
          // "After Hours" build spotlight — folds in the fallback's Tech
          // Stack (skill chips) and the lab projects grid that Story mode
          // otherwise has no slot for (see HANDOFF.md §4/§6 on this
          // judgment call). Staggers in on entry same as projectIntro.
          const buildStart = cursor + weight * 0.05;
          tl.to(buildLabRefs.current.eyebrow, { autoAlpha: 1, y: 0, duration: 0.28 }, buildStart)
            .to(buildLabRefs.current.headline, { autoAlpha: 1, y: 0, duration: 0.4 }, buildStart + 0.08)
            .to(buildLabRefs.current.featured, { autoAlpha: 1, y: 0, duration: 0.4 }, buildStart + 0.25)
            .to(buildLabRefs.current.grid, { autoAlpha: 1, y: 0, duration: 0.35 }, buildStart + 0.42)
            .to(buildLabRefs.current.stack, { autoAlpha: 1, y: 0, duration: 0.35 }, buildStart + 0.56);
        }

        if (s.id === "contact") {
          // Contact finale — the big overlapping "Contact"/"Me" wordmark
          // on black is confirmed real on-frame (§5); the footer signature
          // reuses the exact scale/back.out flourish already established
          // in the fallback site's Footer.tsx, for the "signature
          // animation" this phase asks for.
          const contactStart = cursor + weight * 0.05;
          tl.to(
            contactRefs.current.wordmark,
            { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" },
            contactStart,
          )
            .to(contactRefs.current.tagline, { autoAlpha: 1, y: 0, duration: 0.3 }, contactStart + 0.4)
            .to(contactRefs.current.cue, { autoAlpha: 1, y: 0, duration: 0.3 }, contactStart + 0.55)
            .to(contactRefs.current.links, { autoAlpha: 1, y: 0, duration: 0.3 }, contactStart + 0.68)
            .to(contactRefs.current.footerBar, { autoAlpha: 1, y: 0, duration: 0.35 }, contactStart + 0.85)
            .to(
              contactRefs.current.signature,
              { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.8)" },
              contactStart + 1.05,
            );
        }

        cursor += weight;
      });

      // GSAP's scrub maps scroll progress to tl.progress(), i.e. tl.time()
      // = progress * tl.duration() — and tl.duration() is only as long as
      // the last tween's end time, which falls short of the full weight
      // sum (nothing is tweened all the way to the last scene's tail).
      // Without this, every scene's crossfade fires measurably earlier
      // than its weight-based window intends (~9% off, growing with each
      // scene), independent of the jumpTo()/active-index fix above, which
      // only patches the *reverse* direction (scroll -> label lookup).
      // Pinning an explicit zero-duration marker at the true total weight
      // forces tl.duration() === totalWeightRef so both directions agree.
      tl.to({}, { duration: 0.01 }, cursor);

      timelineRef.current = tl;
    }, wrapRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalTrackPx]);

  const jumpTo = (id: SceneId) => {
    const st = timelineRef.current?.scrollTrigger;
    if (!st) return;
    const idx = SCENES.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const progress = labelPositionsRef.current[idx] / totalWeightRef.current;
    const y = st.start + (st.end - st.start) * progress;
    // Raw window.scrollTo fights with ScrollTrigger's own
    // snap:"labelsDirectional" — that snap mode infers direction from
    // scroll velocity, which a programmatic jump doesn't set, so it was
    // landing on the wrong (sometimes distant) label. gsap.to(...,
    // {scrollTo}) keeps the jump inside GSAP's own scroll-tracking so snap
    // doesn't fight it.
    gsap.to(window, { scrollTo: { y }, duration: 0.6, ease: "power2.inOut" });
  };

  return (
    <div ref={wrapRef} className="relative">
      <div
        ref={stageRef}
        className="relative h-[100dvh] w-full overflow-hidden bg-navy"
      >
        {SCENES.map((s) => {
          return (
            <div
              key={s.id}
              ref={(el) => (sceneRefs.current[s.id] = el)}
              className="absolute inset-0"
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
                <ProjectIntroScene
                  registerRef={(id, el) => (projectIntroRefs.current[id] = el)}
                />
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
            </div>
          );
        })}

        <div className="pointer-events-none absolute inset-0 z-20">
          <div ref={gateTopRef} className="absolute inset-x-0 top-0 h-1/2 origin-top bg-cream" />
          <div ref={gateBottomRef} className="absolute inset-x-0 bottom-0 h-1/2 origin-bottom bg-cream" />
          <div ref={doorLeftRef} className="absolute inset-y-0 left-0 h-full w-1/2 bg-blue" />
          <div ref={doorRightRef} className="absolute inset-y-0 right-0 h-full w-1/2 bg-blue" />
        </div>

        <StoryNav activeId={SCENES[activeIndex].id} onJump={jumpTo} />

        {debug && (
          <div className="absolute bottom-20 left-4 z-50 rounded bg-black/80 px-3 py-2 font-mono text-xs text-signal">
            scene: {SCENES[activeIndex].id} ({activeIndex + 1}/{SCENES.length})
          </div>
        )}
      </div>
    </div>
  );
}
