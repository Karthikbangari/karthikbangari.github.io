import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, ensureGsapRegistered } from "../lib/motion";
import { caseStudies } from "../data/projects";
import { SCENES, SCENE_WEIGHT, type SceneId } from "./sceneConfig";
import StoryNav from "./StoryNav";
import CoverScene from "./scenes/CoverScene";
import OriginScene, { type OriginBeatId } from "./scenes/OriginScene";
import LineArtScene from "./scenes/LineArtScene";
import ProjectIntroScene, { type ProjectIntroRefId } from "./scenes/ProjectIntroScene";
import BestWorkScene from "./scenes/BestWorkScene";
import {
  BuildLabIntroScene,
  BuildLabGridScene,
  BuildLabStackScene,
  type BuildLabIntroRefId,
} from "./scenes/BuildLabScene";
import ContactScene, { type ContactRefId } from "./scenes/ContactScene";

const SCENE_COMPONENTS: Record<SceneId, React.ComponentType<any>> = {
  cover: CoverScene,
  origin: OriginScene,
  lineArt: LineArtScene,
  projectIntro: ProjectIntroScene,
  bestWork: BestWorkScene,
  buildLabIntro: BuildLabIntroScene,
  buildLabGrid: BuildLabGridScene,
  buildLabStack: BuildLabStackScene,
  contact: ContactScene,
};

const PX_PER_WEIGHT = 1400;

export default function Story({ active }: { active: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const gateTopRef = useRef<HTMLDivElement>(null);
  const gateBottomRef = useRef<HTMLDivElement>(null);
  const originBeatRefs = useRef<Record<OriginBeatId, HTMLDivElement | null>>({
    bio: null,
    impact: null,
    timeline: null,
  });
  const lineArtPathRef = useRef<SVGPathElement | null>(null);
  const lineArtLabelRefs = useRef<(SVGTextElement | null)[]>([]);
  const doorLeftRef = useRef<HTMLDivElement>(null);
  const doorRightRef = useRef<HTMLDivElement>(null);
  const projectIntroRefs = useRef<Record<ProjectIntroRefId, HTMLElement | null>>({
    eyebrow: null,
    headline: null,
    tagline: null,
    stack: null,
    cue: null,
  });
  const bestWorkTrackRef = useRef<HTMLDivElement | null>(null);
  const bestWorkPanelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bestWorkDotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buildLabIntroRefs = useRef<Record<BuildLabIntroRefId, HTMLElement | null>>({
    eyebrow: null,
    headline: null,
    featured: null,
  });
  const contactRefs = useRef<Record<ContactRefId, HTMLElement | null>>({
    wordmark: null,
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

      // Origin's 3 internal beats (bio / impact / timeline) stack the
      // same way top-level scenes do — bio visible by default since it's
      // what the cover -> origin gate reveals first.
      gsap.set(originBeatRefs.current.bio, { autoAlpha: 1, zIndex: 10 });
      gsap.set([originBeatRefs.current.impact, originBeatRefs.current.timeline], {
        autoAlpha: 0,
        zIndex: 0,
      });

      // LineArt's path starts fully undrawn — measuring length here (at
      // mount) works because the scene is always rendered, just hidden via
      // autoAlpha, same as the fallback site's IncidentLineDraw.
      const lineArtPath = lineArtPathRef.current;
      const lineArtLen = lineArtPath?.getTotalLength() ?? 0;
      if (lineArtPath) {
        gsap.set(lineArtPath, { strokeDasharray: lineArtLen, strokeDashoffset: lineArtLen });
      }
      gsap.set(lineArtLabelRefs.current, { autoAlpha: 0, y: 8 });

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

      // BestWork's horizontal filmstrip starts on panel 0; dot 0 starts
      // "active", the rest muted — colors set directly (not via Tailwind
      // classes) since GSAP animates the actual CSS property, not classes.
      gsap.set(bestWorkTrackRef.current, { xPercent: 0 });
      gsap.set(bestWorkDotRefs.current, { backgroundColor: "rgba(255,253,247,0.3)", scale: 1 });
      gsap.set(bestWorkDotRefs.current[0], { backgroundColor: "#C8FF22", scale: 1.6 });

      gsap.set(
        [buildLabIntroRefs.current.eyebrow, buildLabIntroRefs.current.headline, buildLabIntroRefs.current.featured],
        { autoAlpha: 0, y: 16 },
      );

      gsap.set(contactRefs.current.wordmark, { autoAlpha: 0, scale: 0.85 });
      gsap.set([contactRefs.current.cue, contactRefs.current.links], { autoAlpha: 0, y: 12 });
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

          if (prev.id === "cover" && s.id === "origin") {
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
            // Generic scene-to-scene handoff — a scale/slide/blur crossfade
            // instead of a flat opacity dissolve, so every cut (not just the
            // two bespoke gate/door ones) reads as a deliberate move rather
            // than a fade. Outgoing scene eases away and up while blurring
            // out; incoming scene arrives from slightly below/larger and
            // sharpens into place, same blur-as-motion language as the
            // cover -> origin gate transition above. Anchored at `cursor`
            // exactly (no lead-in) — Origin's internal beat crossfade runs
            // right up to this same boundary, and starting any earlier
            // visibly collides the blur with that still-finishing swap.
            const segStart = cursor;
            tl.set(curEl, { zIndex: 10 }, segStart)
              .fromTo(
                prevEl,
                { scale: 1, y: 0, filter: "blur(0px)" },
                { scale: 0.96, y: -28, filter: "blur(6px)", autoAlpha: 0, duration: 0.35, ease: "power2.in" },
                segStart,
              )
              .set(prevEl, { zIndex: 0, scale: 1, y: 0, filter: "blur(0px)" }, segStart + 0.35)
              .fromTo(
                curEl,
                { scale: 1.05, y: 28, filter: "blur(6px)", autoAlpha: 0 },
                { scale: 1, y: 0, filter: "blur(0px)", autoAlpha: 1, duration: 0.4, ease: "power2.out" },
                segStart + 0.15,
              );
          }
        }

        if (s.id === "origin") {
          // Origin gets its own 3-beat sequence (bio -> impact -> timeline)
          // inside its single weight-1.6 window, rather than one static
          // panel — same crossfade style as the scene-to-scene transitions
          // above, just nested one level, anchored to this scene's own
          // `cursor`/`weight` so it stays proportional if SCENE_WEIGHT.origin
          // ever changes.
          const originStart = cursor;
          const bioEl = originBeatRefs.current.bio;
          const impactEl = originBeatRefs.current.impact;
          const timelineEl = originBeatRefs.current.timeline;

          const toImpactAt = originStart + weight * 0.56; // ~0.9 into 1.6
          // ~1.36 into 1.6 — finishes (+0.25 duration) with margin before
          // this scene's own end, so the scene-level exit transition's
          // container-wide blur doesn't start compositing on top of this
          // beat swap while it's still mid-flight.
          const toTimelineAt = originStart + weight * 0.85;

          tl.to(bioEl, { autoAlpha: 0, y: -16, duration: 0.25 }, toImpactAt)
            .set(bioEl, { zIndex: 0 }, toImpactAt + 0.25)
            .set(impactEl, { zIndex: 10 }, toImpactAt)
            .fromTo(impactEl, { y: 16 }, { autoAlpha: 1, y: 0, duration: 0.25 }, toImpactAt)

            .to(impactEl, { autoAlpha: 0, y: -16, duration: 0.25 }, toTimelineAt)
            .set(impactEl, { zIndex: 0 }, toTimelineAt + 0.25)
            .set(timelineEl, { zIndex: 10 }, toTimelineAt)
            .fromTo(timelineEl, { y: 16 }, { autoAlpha: 1, y: 0, duration: 0.25 }, toTimelineAt);
        }

        if (s.id === "lineArt") {
          // The line draws itself as you scroll through this scene's own
          // window — confirmed real on-frame (§5) — instead of sitting on
          // screen fully drawn. Labels stagger in alongside the stroke,
          // same technique as the fallback site's IncidentLineDraw, just
          // driven by the master scrub instead of its own ScrollTrigger.
          const drawStart = cursor + weight * 0.15;
          const drawDuration = weight * 0.6;

          if (lineArtPathRef.current) {
            tl.to(
              lineArtPathRef.current,
              { strokeDashoffset: 0, duration: drawDuration, ease: "power1.inOut" },
              drawStart,
            );
          }
          tl.to(
            lineArtLabelRefs.current,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.2,
              stagger: drawDuration / Math.max(lineArtLabelRefs.current.length, 1),
            },
            drawStart,
          );
        }

        if (s.id === "bestWork") {
          // Horizontal filmstrip through the case studies, inside
          // BestWork's own (largest) weight window — equal thirds, each
          // boundary also registered as a master-timeline label so the
          // existing `snap: "labelsDirectional"` (built for scene-to-scene
          // snapping) settles on project boundaries too, for free, with no
          // second ScrollTrigger.
          const n = caseStudies.length;
          const segWeight = weight / n;

          for (let p = 1; p < n; p++) {
            const boundaryAt = cursor + p * segWeight;
            const slideDuration = segWeight * 0.4;
            const slideStart = boundaryAt - slideDuration;

            tl.addLabel(`bestWork-${p}`, boundaryAt);
            tl.to(
              bestWorkTrackRef.current,
              { xPercent: -100 * p, duration: slideDuration, ease: "power2.inOut" },
              slideStart,
            )
              .to(bestWorkDotRefs.current[p - 1], { backgroundColor: "rgba(255,253,247,0.3)", scale: 1, duration: slideDuration }, slideStart)
              .to(bestWorkDotRefs.current[p], { backgroundColor: "#C8FF22", scale: 1.6, duration: slideDuration }, slideStart);
          }
        }

        if (s.id === "projectIntro") {
          // Brief title-card entrance, revealed right as the blue doors
          // finish opening onto it.
          const introStart = cursor + weight * 0.05;
          tl.to(projectIntroRefs.current.eyebrow, { autoAlpha: 1, y: 0, duration: 0.2 }, introStart)
            .to(projectIntroRefs.current.headline, { autoAlpha: 1, y: 0, duration: 0.3 }, introStart + 0.05)
            .to(projectIntroRefs.current.tagline, { autoAlpha: 1, y: 0, duration: 0.2 }, introStart + 0.2)
            .to(projectIntroRefs.current.stack, { autoAlpha: 1, y: 0, duration: 0.2 }, introStart + 0.28)
            .to(projectIntroRefs.current.cue, { autoAlpha: 1, y: 0, duration: 0.2 }, introStart + 0.36);
        }

        if (s.id === "buildLabIntro") {
          // "After Hours" build spotlight intro — folds in the featured
          // build card that Story mode otherwise has no slot for (see
          // HANDOFF.md §4/§6 on this judgment call). Staggers in on entry
          // same as projectIntro; the project grid and tech stack now live
          // on their own following pages instead of cramming in here too.
          const buildStart = cursor + weight * 0.1;
          tl.to(buildLabIntroRefs.current.eyebrow, { autoAlpha: 1, y: 0, duration: 0.2 }, buildStart)
            .to(buildLabIntroRefs.current.headline, { autoAlpha: 1, y: 0, duration: 0.3 }, buildStart + 0.05)
            .to(buildLabIntroRefs.current.featured, { autoAlpha: 1, y: 0, duration: 0.3 }, buildStart + 0.18);
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
            { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)" },
            contactStart,
          )
            .to(contactRefs.current.cue, { autoAlpha: 1, y: 0, duration: 0.25 }, contactStart + 0.3)
            .to(contactRefs.current.links, { autoAlpha: 1, y: 0, duration: 0.25 }, contactStart + 0.4)
            .to(contactRefs.current.footerBar, { autoAlpha: 1, y: 0, duration: 0.3 }, contactStart + 0.55)
            .to(
              contactRefs.current.signature,
              { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(1.8)" },
              contactStart + 0.7,
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
          const Comp = SCENE_COMPONENTS[s.id];
          return (
            <div
              key={s.id}
              ref={(el) => (sceneRefs.current[s.id] = el)}
              className="absolute inset-0"
            >
              {s.id === "cover" ? (
                <CoverScene active={active} />
              ) : s.id === "origin" ? (
                <OriginScene
                  registerBeat={(id, el) => (originBeatRefs.current[id] = el)}
                />
              ) : s.id === "lineArt" ? (
                <LineArtScene
                  registerPath={(el) => (lineArtPathRef.current = el)}
                  registerLabel={(i, el) => (lineArtLabelRefs.current[i] = el)}
                />
              ) : s.id === "projectIntro" ? (
                <ProjectIntroScene
                  registerRef={(id, el) => (projectIntroRefs.current[id] = el)}
                />
              ) : s.id === "bestWork" ? (
                <BestWorkScene
                  registerTrack={(el) => (bestWorkTrackRef.current = el)}
                  registerPanel={(i, el) => (bestWorkPanelRefs.current[i] = el)}
                  registerDot={(i, el) => (bestWorkDotRefs.current[i] = el)}
                />
              ) : s.id === "buildLabIntro" ? (
                <BuildLabIntroScene registerRef={(id, el) => (buildLabIntroRefs.current[id] = el)} />
              ) : s.id === "contact" ? (
                <ContactScene registerRef={(id, el) => (contactRefs.current[id] = el)} />
              ) : (
                <Comp />
              )}
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
