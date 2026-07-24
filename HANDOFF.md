# Handoff — karthikbangari.github.io portfolio rebuild

Snapshot as of 2026-07-24. Read this before doing anything else — a lot has happened across one
very long session and the repo is currently mid-rewrite.

## 1. Live site status

**https://karthikbangari.github.io/** is live and reflects commit `476747c` on `main` — the full
redesign through "Phase 4" of the motion system (see §3). It does **not** yet include the new
pinned-viewport "Story" experience described in §4 — that work is uncommitted.

## 2. Repo / branch status

- On `main`. No separate feature branch currently — recent work has gone straight to `main` and
  been pushed as each milestone completed, then verified live before moving on.
- **Uncommitted right now**: the entire pinned-viewport Story rewrite (`site/src/story/`,
  `site/src/lib/useDesktopStoryMode.ts`, `site/src/lib/motion.ts` ScrollToPlugin addition,
  `App.tsx` branching), plus a fresh video re-analysis (`animation-analysis/MOTION_ANALYSIS.md`,
  `animation-analysis/dense/`, `animation-analysis/contact-{4,10,16,22}s.jpg`), plus a rebuilt
  `assets/*.js/css` bundle reflecting all of that. Run `git status` before doing anything
  destructive.
- `references/` (gitignored) has the CV PDF, the reference portfolio PDF, and the screen
  recording. `animation-analysis/` (NOT gitignored — was committed once already) has extracted
  video frames, contact sheets, and two analysis docs.

## 3. What's done and live (commit `476747c`)

Chronological summary — each of these was a distinct user-directed pass:

1. **Full portfolio rebuild** from the old "Karthik Valley OS" 3D/Pixar-style site into a
   recruiter-focused DevOps portfolio. New source lives in `site/` (Vite + React + TS +
   Tailwind), builds straight to the repo root (`site/vite.config.ts` — `outDir` is `..`,
   `emptyOutDir: false` on purpose, since GitHub Pages serves the repo root of `main` directly,
   no Actions workflow). Real CV facts wired into `site/src/data/*.ts` (email, LinkedIn, GitHub
   confirmed via git remote, EU work-authorization, Terraform cert, etc.) — see
   `PORTFOLIO_UPGRADE_PLAN.md` for the original audit.
2. **Editorial visual redesign** to a bold blue/cream/black system (royal blue `#173DE5`, deep
   blue `#0D28B8`, cream `#F4EFE5`, paper white `#FFFDF7`, lime `#C8FF22`, black `#0C0C0C`) after
   feedback that the first pass read as "a generic dark SaaS template." Contrast values for this
   palette were independently recomputed against WCAG AA (documented inline in
   `site/tailwind.config.js`) — a couple of the user's exact hex asks needed small adjustments to
   stay accessible.
3. **Motion system, built in 4 phases** (GSAP + ScrollTrigger): animated preloader, pinned
   hero/contents/impact assembly, paper-panel transitions, animated architecture pipelines with a
   traveling signal dot, Terraform's typed-in module tree, Observability's hand-drawn SVG
   incident line-draw on black (closest 1:1 match to real video evidence found in this whole
   project), chapter interstitial, 4-panel split reveal, Experience's scroll-scrubbed timeline,
   Build Lab's horizontal scroll-snap gallery, Tech Stack traveling signal, Resume paper-drop,
   Contact/Footer entrance sequences, a fixed chapter-progress dot indicator.
4. **Content correctness fixes**: Experience end date corrected to match the CV ("March 2024 –
   April 2026", was wrongly showing "present"), all visible "TODO"/"add link" placeholder text
   removed and replaced with honest phrasing ("Live — link on request", "Verification available
   on request").

**Real bugs found and fixed along the way** (worth knowing before touching this code again):
- React 18 StrictMode double-invoke breaking a sessionStorage-gated preloader (fixed via a lazy
  `useState` initializer instead of read-then-write inside the effect).
- A double-rotation bug in Impact Dashboard (wrapper + child both animating `rotate` to the same
  target compounded the angle).
- `ChapterProgress` showing the wrong active chapter — using pinned sections as `ScrollTrigger`
  triggers for a second independent trigger is fragile; rewritten to track scroll position
  against precomputed offsets instead.
- A real mobile horizontal-overflow regression: `Resume.tsx` was missing `overflow-hidden`, so an
  off-screen GSAP starting transform leaked into `document.documentElement.scrollWidth`. **Any
  component with an off-screen `x`/`y` starting transform before a reveal needs `overflow-hidden`
  on its containing section, or this bug recurs.**

## 4. What's in progress (uncommitted): pinned-viewport "Story" rewrite

The user watched the reference recording again and concluded the site should not scroll like a
normal webpage at all — it should be a fixed-viewport slide presentation where scroll advances one
master GSAP timeline, with scenes crossfading/panning/opening inside a pinned stage, plus a fixed
top strip and bottom chapter nav. This is a 7-phase plan (Foundation → Opening → Origin →
Interstitial → Best Work → Ending → Responsive/QA). **All 7 phases are now built**, including
Phase 7 (Responsive/QA).

### Key architecture decision

Rather than deleting the verified section-based site from §3, it's kept as a **fallback**:

- `site/src/lib/useDesktopStoryMode.ts` — `useDesktopStoryMode()` returns true when viewport
  width ≥ 768px AND `prefers-reduced-motion` is not set. Decided once per mount (lazy
  `useState`), not reactive to resize.
- `site/src/App.tsx` — branches at the top level: `storyMode ? <Story /> : <FallbackSite />`.
  `FallbackSite` is exactly the §3 content, untouched.
- **This means the fallback can never regress no matter what happens to the Story rewrite** —
  mobile and reduced-motion users always get the fully verified experience.

### Story implementation (`site/src/story/`)

- `Story.tsx` — the orchestrator. One pinned `.story-stage` (`h-[100dvh] overflow-hidden`), one
  GSAP master timeline with a `ScrollTrigger` (`pin`, `scrub: 0.7`, `snap: "labelsDirectional"`),
  scene labels added at weighted cumulative positions (scenes aren't equal size — see
  `sceneConfig.ts`'s `SCENE_WEIGHT`). Scenes are absolutely positioned, stacked, and crossfaded
  via `autoAlpha` as the timeline crosses each label. Per-scene internal choreography (Origin's 3
  beats, lineArt's line-draw, etc.) lives in this same master timeline too, via a
  `register*(id, el)` callback prop pattern each scene component exposes — never a second
  ScrollTrigger (see bug #1 below for why that's fragile).
- `sceneConfig.ts` — the 7 scenes (`cover`, `origin`, `lineArt`, `projectIntro`, `bestWork`,
  `buildLab`, `contact`) and their relative scroll weight.
- `StoryNav.tsx` — fixed cream top strip (name + tagline) and bottom chapter nav (click-to-jump).
- `scenes/*.tsx` — one component per scene. Content is condensed from the fallback's data files:
  **`origin` folds in Impact + Experience content, `buildLab`/`contact` fold in Tech Stack/Resume**
  — the new 7-scene structure doesn't have a 1:1 slot for every section in §3. The `origin` half of
  this was a judgment call that got confirmed with the user in Phase 3 (see below); the
  `buildLab`/`contact` half is still open (see §6).

### Three real bugs found and fixed in Phase 1 (this architecture is bug-prone — expect more)

1. Nav-highlight "active scene" was computed via uniform division (`progress * SCENES.length`),
   which doesn't match reality once scenes have unequal weights. Fixed by comparing against real
   weighted label positions.
2. Click-to-jump math divided by `tl.duration()` (GSAP's tween-driven duration) while the actual
   scroll-track length came from a separately-computed weight sum — these silently diverged
   (`tl.duration()` is only as long as the tweens actually in it, not the full label spacing), so
   clicking "Origin" landed at `scrollY: 0`. Fixed by storing label positions + total weight in
   refs and never touching `tl.duration()` for scroll math.
3. Even after #2, jumps still intermittently landed on the wrong scene. Root cause: raw
   `window.scrollTo()` fights with `ScrollTrigger`'s `snap: "labelsDirectional"`, which infers
   direction from scroll *velocity* — a programmatic jump doesn't set that, so GSAP's own
   snap-back could resolve to the wrong adjacent label. Fixed by installing `ScrollToPlugin`
   (confirmed part of the free GSAP bundle — not a paid Club GreenSock plugin) and using
   `gsap.to(window, { scrollTo })` instead of raw `window.scrollTo`.

All verified: pin holds (`.pin-spacer` present, viewport stays fixed through all 7 scenes),
click-to-jump 7/7 correct and repeatable, reduced-motion and mobile both correctly render
`FallbackSite` (not Story), no horizontal overflow, no ScrollTrigger markers left in, and a full
production build serves with zero console errors.

### Phase 2 — Opening

- **Preloader** (`components/Preloader.tsx`, shared by both Story and Fallback): now cycles 3
  phrase pairs ("I build / reliable systems", "I automate / the repeatable", "I observe / what
  matters") — each scatters in with blur, holds, then scatters out except the last — instead of
  one static hold, matching the confirmed on-frame mechanic from `MOTION_ANALYSIS.md` (scattered
  words converging as % climbs). Copy is original, not copied from the reference creator's own
  wordmark/brand text.
- **CoverScene assembly** (`story/scenes/CoverScene.tsx`): now takes an `active` prop (wired from
  `App.tsx`'s `introDone`, same pattern as the fallback `Hero`) and staggers in on preloader
  handoff — eyebrow, headline, photo, badges, CTAs, availability, scroll cue — instead of
  rendering fully static.
- **Cover exit + cream paper-gate into Origin** (`story/Story.tsx`): the cover→origin scene
  boundary is special-cased (not the generic 0.3-unit crossfade used elsewhere) — cover
  scales down to 0.94 with `blur(10px) brightness(0.5)`, two cream panels (reusing the
  `PaperSceneTransition` visual language: same cream color, slight opposite rotation) slide in
  from top and bottom to fully cover the stage, the scene swap happens hidden behind the closed
  gate, then the gate slides back out revealing Origin. `gateTopRef`/`gateBottomRef` added to
  `Story.tsx`, positioned off-stage at mount.

**Real bug found and fixed while building this** (affects the *whole* Story timeline, not just
Phase 2): GSAP's scrub drives `tl.progress()`, i.e. `tl.time() = progress * tl.duration()` — and
`tl.duration()` was only **7** against a `totalWeightRef` of **7.7** (confirmed by temporarily
logging both), because duration is bounded by the last tween's end time, and nothing was ever
tweened all the way to the final scene's tail. This silently compressed every scene's crossfade to
fire ~9% earlier than its weight-based window intended, growing across the timeline — independent
of the earlier jumpTo()/active-index fix (bug #2 above), which only patches the reverse direction
(scroll position → label lookup), not this forward direction (scrub progress → tween timing). Fixed
with a single explicit zero-duration marker pinned at the true total weight
(`tl.to({}, { duration: 0.01 }, cursor)` after the scene loop), forcing `tl.duration() ≈
totalWeightRef` (confirmed 7.71 vs 7.7 after the fix). Worth remembering if later phases' scene
transitions seem to land slightly off from where their weight allocation suggests they should.

**How this was verified** (no `chromium-cli` in this environment): dev server + a scratch
Playwright script (`playwright` + cached Chromium installed ad hoc in a scratch dir, same pattern as
the `ffmpeg-static` note in §8) recording video of a continuous scripted scroll, frames extracted
via `ffmpeg-static` at 8fps, viewed as contact sheets. Confirms: preloader phrase-cycling, cover
assembly stagger, cover blur/darken/scale, cream gate fully closing and reopening (with a visible
diagonal "paper" tilt from the intentional slight rotation) onto Origin, nav/debug HUD scene-index
tracking staying correct throughout. No console errors. Direct `window.scrollTo()` jumps were tried
first and gave misleading results — they fight the `snap: "labelsDirectional"` config
unpredictably; continuous small wheel steps are what actually reproduces real scroll behavior.

### Phase 3 — Origin

Asked the user directly whether Origin should stay one static panel or split into sequential beats
— they chose **a light multi-panel sequence**. `OriginScene.tsx` now exports 3 internal beats
(`bio`, `impact`, `timeline`) stacked absolutely inside one scene container, each registered back
to `Story.tsx` via a `registerBeat(id, el)` callback prop (mirrors how `sceneRefs` works one level
up). `Story.tsx` drives the crossfade between them as part of the *same* master timeline, anchored
proportionally within Origin's own `cursor`/`weight` window (`toImpactAt`/`toTimelineAt` at ~56%/
~94% through Origin's 1.6-weight span) — no second ScrollTrigger, consistent with why bug #1 above
says a second independent trigger is fragile.
- **bio**: the original headline + 2 bio paragraphs + signature (stats/timeline removed from here).
- **impact**: all 6 `metrics` entries (was `slice(0,3)`) as tiles with their `description` text,
  now that impact gets its own full screen instead of sharing space with bio.
- **timeline**: all 3 `experienceStages` with up to 4 `highlights` bullets each and the "Promoted"
  badge (was just year/title/badge, no highlights, when squeezed into the single-panel version).

Verified clean, uncramped rendering of each beat in isolation and correct crossfades in
`frames_origin/f_053.jpg` (impact, 6 tiles with room to spare) and `f_060.jpg`/`f_059.jpg` (timeline
mid-crossfade into the next scene). Nav pill and debug HUD correctly stay on "Origin" through all 3
beats, only advancing to the next top-level scene at Origin's actual boundary. One thing to know:
mid-crossfade capture frames can show 2-3 beats blended/overlapping at once (bio+impact, or even
impact+timeline+lineArt together) — that's expected transient scrub blending during fast continuous
scroll, not a bug; it resolves cleanly once scrolling settles, same as the top-level scene
crossfades in Phase 1.

**Not yet checked**: whether the impact/timeline beats' taller content (6 tiles / 3×4 bullets)
still fits without clipping at short-viewport desktop widths (e.g. a laptop window under ~700px
tall) — `useDesktopStoryMode` only gates on width (≥768px), not height, and beats use
`overflow-hidden` with no scroll fallback. Only tested at 1440×900. Worth covering in Phase 7
(Responsive/QA) rather than assuming it's fine.

### Phase 4 — Interstitial

Three pieces, all driven by the same master timeline via the `register*` callback pattern:

- **LineArt line-draw** (`scenes/LineArtScene.tsx` + `Story.tsx`): the SVG path now exposes itself
  via `registerPath`, and 5 word labels (`build`/`secure`/`ship`/`observe`/`recover`) via
  `registerLabel(index, el)`. `Story.tsx` measures `getTotalLength()` at mount (same trick as the
  fallback's `IncidentLineDraw` — the scene is always rendered, just hidden via `autoAlpha`, so the
  path exists in the DOM to measure) and scrubs `strokeDashoffset` from full length to 0 across
  ~60% of lineArt's own weight window, with labels staggering in alongside. Confirmed genuinely
  drawing progressively frame-by-frame in `frames_phase4/f_051`–`f_070` (roughly), not just
  popping in fully drawn.
- **Center-split blue doors** (`Story.tsx`, new `doorLeftRef`/`doorRightRef`): a second gate type,
  distinct from Origin's cream one — flat, no rotation (the footage reads as a clean mechanical
  cut, not a paper texture), two `bg-blue` halves (`w-1/2` each) sliding in from the left/right
  edges to meet at dead center, swap happening behind the closed seam, then both continuing back
  out the same side they came from. Placed at the lineArt → projectIntro boundary specifically
  because `MOTION_ANALYSIS.md` (§5) confirms this mechanic right before the reference's Best-Work
  content, and `projectIntro`'s own background is already blue, so the doors visually "are" the
  destination scene's color. Confirmed clean and symmetric in `frames_phase4/f_076.jpg` (mid-close,
  full width, no seam gap) and `f_099.jpg` (reopened, staggered content visible mid-reveal).
- **ProjectIntroScene entrance** (`scenes/ProjectIntroScene.tsx` + `Story.tsx`): was fully static;
  now exposes `eyebrow`/`headline`/`tagline`/`stack`/`cue` via `registerRef(id, el)` and staggers
  in right as the doors finish opening — confirmed `f_099.jpg` shows headline fully in, tagline
  mid-fade, stack/cue not yet appeared, i.e. the stagger is real, not simultaneous.

**Testing note carried forward**: the first pass at verifying this scrolled too fast through the
whole lineArt→doors→projectIntro window in a handful of frames because the "fast-forward past
cover+origin" phase of the test script overshot past it entirely — recalibrated the fast-phase
scroll distance against the actual weight-to-pixel math (`totalWeightRef * PX_PER_WEIGHT`) before
re-running. Worth remembering when scripting future phase verifications: compute the target
scene's real pixel window first, don't guess a tick count.

### Phase 5 — Best Work

BestWork's static 3-card grid became a horizontal filmstrip through the 3 `caseStudies`, inside
BestWork's own (largest, weight-2) window:

- **Filmstrip mechanic** (`scenes/BestWorkScene.tsx` + `Story.tsx`): 3 panels in a `flex` row
  (`registerTrack`/`registerPanel` callbacks), each panel `w-full shrink-0` so the track naturally
  overflows to 300% width with only one panel visible at a time (`overflow-hidden` on the parent).
  `Story.tsx` splits BestWork's weight into equal thirds and tweens the track's `xPercent` to
  `-100 * p` approaching each third's boundary — same "slide finishes right at the boundary"
  convention as the doors/gate transitions elsewhere.
- **Directional snapping at project boundaries** (the phase's other explicit ask): rather than a
  second ScrollTrigger, each boundary is registered as an *extra* label on the same master timeline
  (`tl.addLabel(\`bestWork-${p}\`, boundaryAt)`) — the existing `snap: "labelsDirectional"` (built
  for scene-to-scene snapping) picks these up automatically as valid snap targets too, for free.
- **Progress indicator**: 3 small dots, animated via direct `backgroundColor`/`scale` tweens (not
  Tailwind class toggling, since GSAP tweens actual CSS properties) synced to the same boundary
  tweens — confirmed in `frames_phase5/f_056.jpg` showing dot 2 of 3 correctly lit while on the
  Terraform panel, eyebrow correctly reading "2 / 3".
- Each panel condenses `CaseStudyCard`'s richer fallback-site content (problem list, architecture
  chips, impact stats) down to one screen's worth — dropped the strategy blocks, controls list, and
  incident timeline sections that exist in the fallback version, since a full case-study's worth of
  content doesn't fit one pinned viewport. Worth knowing if the user expected the incident timeline
  (Observability's line-draw, called out in §3 as the closest 1:1 match to real footage) to appear
  here — it currently doesn't in Story mode.

Verified: all 3 panels render fully readable with room to spare, slide transitions are smooth,
dots/eyebrow counter stay in sync, and it flows cleanly into Build Lab afterward. No console errors,
typecheck and production build both pass.

### Phase 6 — Ending

Made the `buildLab`/`contact` scene-mapping judgment call myself this time (§6 flagged it as open,
user said "go" rather than answering directly) — documenting it here rather than blocking on it,
same spirit as how Origin's mapping started as a judgment call before being confirmed in Phase 3.

- **Build Lab** (`scenes/BuildLabScene.tsx`): was just `featuredBuild` + a row of skill-group
  *names* (no actual skills). Now also shows all 6 `labProjects` (previously not represented in
  Story mode at all) as a compact grid, and up to 14 individual skill chips instead of just group
  labels. Staggers in on entry, same `register*` + weight-window pattern as projectIntro/origin.
- **Contact finale** (`scenes/ContactScene.tsx`): was a plain navy heading + link list. Now a big
  overlapping "Contact"/"Me" wordmark (blue/cream) on black — confirmed real on-frame in §5
  ("'Contact' in blue overlapping 'Me' in cream/white") — plus the same say-hi/links content, plus
  a cream footer strip with a signature flourish (scale + `back.out` ease) reusing the exact
  technique already established in the fallback site's `Footer.tsx`, fulfilling this phase's
  "signature animation" ask directly.

**Real bug found and fixed**: the new footer strip (with the signature) was rendering correctly —
right opacity, right position, confirmed via `getBoundingClientRect`/`elementFromPoint` — but was
**completely invisible on screen**. Took a while to pin down because every symptom pointed away from
the real cause: `tl.duration()` had grown to 7.8 (my signature tween's end time is later than the
zero-duration marker from the Phase-2 fix, which only pins duration to be *at least*
`totalWeightRef` — it doesn't cap it), so I first suspected that fix had regressed; confirmed via
live polling that `tl.progress()` does reach exactly `1.000` at true max scroll, so the animation
timeline itself was completing correctly. The actual cause: any scene content sitting at the very
bottom edge of the stage (`bottom-*` positioning, or a flex-col child that naturally lands there)
gets covered by `StoryNav`'s fixed bottom chapter-nav bar (`z-40`), since both are cream-colored and
blend together with no visible seam — easy to miss by eye even when looking right at it. Fixed by
giving `ContactScene`'s root `pb-16` so its footer strip stops before that zone. Also fixed **the
same latent bug** in `CoverScene`'s "Scroll to begin ↓" cue (`bottom-8` → `bottom-16`), which I'd
noticed but left unconfirmed back in Phase 2's writeup — now confirmed it really was hidden, and
really is fixed.

This class of bug — content quietly hidden behind fixed chrome, invisible in code review, only
findable by actually looking at a rendered screenshot at the specific scroll position — is worth
remembering for any future scene content that wants to sit near the stage's bottom edge.

### Phase 7 — Responsive/QA

Tested the full breakpoint list end to end via scripted Playwright passes (no code changes were
needed — this phase came back clean):

- **Breakpoint sweep** (1920×1080, 1440×900, 1280×800, 1024×768, 768×1024, 767×844, 390×844):
  confirmed `useDesktopStoryMode`'s width≥768 branch is exact — Story renders (`.pin-spacer`
  present) at 768px and above, `FallbackSite` renders below it — at every size, with zero
  horizontal overflow (`scrollWidth === clientWidth`) and zero console errors.
- **Short-viewport content check** (1024×768 specifically, since that's the realistic "laptop
  window not maximized" case and the one Phase 3's writeup flagged as untested): Cover, Origin's
  bio/impact/timeline beats, Build Lab, and Contact all render without clipping — confirmed via
  screenshots at each. This was the specific risk flagged after Phase 3 and Phase 6's fixed-chrome
  bug; both are now addressed.
- **Reduced motion**: emulated `prefers-reduced-motion: reduce` at 1440×900 (well above the desktop
  threshold) — confirmed `FallbackSite` renders (no `.pin-spacer`), same as narrow-width mobile,
  exactly as `useDesktopStoryMode` is designed to do.
- **Mobile scroll-through** (390×844, `FallbackSite`): sampled `scrollWidth` vs `clientWidth` at 15
  scroll positions from top to bottom of the whole page — no overflow at any point, confirming the
  Phase-1 `Resume.tsx` overflow fix (§3) is still holding and nothing in this session's Story-mode
  work regressed it (expected, since none of this session touched fallback components, but worth
  confirming rather than assuming).

Given Phase 6 turned up a real "content hidden behind fixed chrome" bug that was invisible without
an actual rendered screenshot, this pass specifically prioritized visual verification over
code-reading for exactly that failure mode — and found no further instances of it.

## 5. Video analysis — what's real vs. invented in the prompts driving this

Two rounds of frame-by-frame analysis were done on `references/ScreenRecording_07-16-2026
19-06-10_1.MP4` (the "(1)" and "(2)" filenames mentioned in later prompts don't exist as separate
files — confirmed via filesystem search — same video both times). **Important finding: this is not
a clean screen capture.** It's a phone recording of an Instagram repost of the portfolio creator's
own demo reel — visible phone-UI chrome (like/comment/share counts), the creator's own selfie-cam
cutaways, and a shaky angled view of a MacBook screen with a hand on the trackpad.

Confirmed real from the footage: a percentage-counter preloader with a "Skip Animation" button and
words that start scattered/misaligned and converge as % climbs; a cursive logo hold; a hand-drawn
white line drawing itself on black; a genuine center-split blue-doors transition; an "Insomniac
Work" interstitial; a black/cream Contact finale.

**Not confirmed, and shouldn't be treated as ground truth**: any frame-precise mechanics (exact
`xPercent` values, "300vw canvas," decisecond transition timestamps) — the footage doesn't have
that fidelity. Also, an earlier read of one segment as "an unrelated Instagram reel" was corrected
on the second pass — it's more likely a real Best Work case-study card (a client project involving
someone named "Krishna Shukla"), not noise — but it is **not** a separate "About/Origin" page, which
is what one of the driving prompts assumed for that time range. See
`animation-analysis/MOTION_ANALYSIS.md` for the full writeup.

## 6. Open items / questions for the user

- **GitOps full-pin scope trade-off** (from Phase 2 of the motion system): the correction prompt
  asked for GitOps to be a full 250–350%-scroll pinned mega-scene; a lighter reveal-choreography
  was built instead to avoid stacking a 4th/5th pin on an already pin-heavy page. User has not
  reacted to this trade-off yet.
- **Minor cosmetic overlap**: at ~1280px width, Contact's "say hi before overthinking it" text
  slightly overlaps the fixed `ChapterProgress` pill (this is in the §3 fallback site, predates
  the Story rewrite). Not fixed, not blocking.
- **Scene-to-section mapping in the Story rewrite** (§4): folding Impact/Experience into `origin`
  was confirmed with the user during Phase 3 — they chose a light multi-panel sequence over a
  single static screen (see §4's Phase 3 writeup). Tech Stack/Resume folded into `buildLab`/
  `contact` was asked about before Phase 6 but the user said "go" rather than answering directly —
  built it as a judgment call instead (documented in §4's Phase 6 writeup). **Still genuinely
  open**: whether that specific judgment call (labProjects grid + skill chips in Build Lab, the
  Contact/Me wordmark treatment) is what they actually wanted — worth a real look before calling
  Phase 6 done.
- **Content placeholders still unfilled** (unrelated to any of the motion work): Chrome Web Store
  link for Git File Explainer, case-study repo/demo links + evidence screenshots, "what I'd
  improve next" reflections per case study, Terraform cert verification link. All currently show
  honest "available on request" placeholders, not fabricated content.
- **`animation-analysis/` size**: contains real video frames (several MB of JPEGs) committed to
  the repo per the user's explicit "commit all" instruction earlier in the session. Worth
  reconfirming they still want this shipped long-term in a public portfolio repo.

## 7. Next steps

All 7 phases of the Story rewrite's own plan are built and individually verified (§4). Nothing has
been committed or pushed — the whole thing is still sitting uncommitted, per the user's explicit
"never commit/push without go-ahead" rule (§8). What's actually left is not more phases, it's the
open items in §6:

- Get real user reaction to the whole Story experience end to end (this session only ever verified
  it programmatically, phase by phase — nobody has watched it scroll as a human yet).
- Resolve the two still-open judgment calls: the GitOps full-pin scope trade-off, and whether the
  Build Lab/Contact scene-mapping this session chose is actually what was wanted.
- Fill the remaining honest placeholders (Chrome Web Store link, case-study evidence, Terraform
  cert link) whenever those real assets exist.
- Decide on `animation-analysis/`'s long-term place in the repo (§6).
- Then: commit, verify live, and only then consider this rewrite "shipped."

## 8. How to verify locally

```bash
cd site
npm run typecheck   # tsc --noEmit
npm run dev          # local dev server
npm run build         # writes index.html + assets/*.js/css to repo root
```

No system `ffmpeg` is installed — `ffmpeg-static` was installed ad hoc in the session's scratchpad
directory for video analysis; if more frame extraction is needed later, reinstall it the same way
(`npm install ffmpeg-static` in a scratch dir, binary at `node_modules/ffmpeg-static/ffmpeg`).

Never commit/push without explicit go-ahead — GitHub Pages deploys immediately on push to `main`,
there is no staging environment.
