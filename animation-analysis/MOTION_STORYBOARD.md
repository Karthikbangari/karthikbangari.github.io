# Motion Storyboard — analysis of the reference recording

Source: `references/ScreenRecording_07-16-2026 19-06-10_1.MP4` (30.97s, 1290×2796, 59.5fps capture).
Frames extracted at 0.5s intervals to `animation-analysis/frames/` (62 frames), contact sheet at
`animation-analysis/contact-sheet.jpg` (full-res, 3440×7456) and a scaled overview at
`contact-sheet-small.jpg`. Selected frames re-extracted at higher quality to `animation-analysis/hires/`.

## Important finding before anything else

**This is not a clean screen capture.** It's a phone recording of someone watching an Instagram/TikTok
repost of the portfolio creator's own demo reel — the frame shows a phone UI (like/comment/share/save
counts: 13.8K/204/151/12.6K, a caption "Huge shoutout to @bajkamal07...", audio "Boney M. – Rasputin",
a comment box) with a MacBook visible at an angle inside that video, plus cutaways to the creator's own
selfie-cam face shots. This means:

- I cannot extract exact easing curves, frame-accurate timing, or pixel-precise transforms — the source
  is a re-recording of a re-recording, shot at an angle, with visible keyboard/hand/reflections.
- What I *can* extract reliably: the **sequence of scenes**, **what elements appear**, **roughly how
  they move relative to each other**, and **the overall pacing feel**. That's what's documented below.
- Where the source used content specific to the original creator (his name, "Delhi Metro", Hindi text,
  personal branding), those are noted as "concept to adapt," not "content to copy" — consistent with
  the standing instruction not to reproduce the original person's identity or content.

## Scene-by-scene (grounded in actual frames)

| Time | What's visible | Elements entering/leaving | Notes for implementation |
|---|---|---|---|
| 0–4s | Selfie cutaways of the creator talking to camera | face, captions | Not reproducible/relevant — skip |
| ~4.5s | **Preloader**, blue bg. Scattered words: "I ___ Intentionally", "make ___ Misalignment", "look ___", a **"49%"** counter with a thin progress bar bottom-left, a **"Skip Animation →"** button top-right | Words appear pre-assembled/scattered, not literally typing in | Confirms: percentage counter + progress bar + explicit skip button. Words look deliberately mis-set (different sizes/positions) before implying they'd align — matches the "momentarily misaligned" idea in the brief |
| ~9s | **Hero**, blue bg. Cursive "baaz"-equivalent wordmark large and center, "Started as / Designer", "Became / Artist Manager", "Currently / Creative Director" stacked left, a small circular "**Go on, scroll down**" cue floating center-low, a **bottom floating pill nav** (Home / Projects / Best Work / Visuals / Contact) | wordmark + micro-story stack together, floating nav is separate/persistent | Confirms hero composition already built (wordmark + micro-story). New info: a floating "scroll down" affordance, and nav as a bottom pill rather than (only) a top bar |
| ~16.5–17s | **Black full-screen scene**, a cursive/handwritten word or flourish drawing itself as a white SVG stroke, section nav bar visible below with one tab (`Origin`) highlighted blue mid-transition | line drawing appears stroke-by-stroke | This is the real source of "hand-drawn line traces itself" — in the original it reads as a signature/word draw-in on black, used as a **section-to-section transition**, not literally an incident chart. Adapting this concept to Observability's incident timeline (as the correction brief proposes) is a reasonable creative translation, not a literal copy |
| ~20–23s | **"Best Work"** torn-paper-style label (rotated, sticker-like), a **horizontal metro-line diagram** with train-car icons marking progress across projects (styled as "Delhi Metro", station names, an "instruction manual" mini-panel explaining swipe controls), a train-car illustration with doors at the bottom | metro map + instruction panel enter together | This is a **bespoke, theme-specific interactive index** for one project (a transit-themed campaign) — not a universal site pattern. The transferable *principle*: each case study gets a distinct, illustrated "entering the project" moment, not a plain heading. For Karthik, the GitOps pipeline (nodes + traveling signal dot) is the equivalent idea already in the brief — keep that, don't literally build a metro map |
| ~24–31s | More card/label transitions, back to selfie, then the phone's own home-screen dock at the very end (Instagram, Twitter, Gmail, Notion, Slack icons) | — | Tail end is just the recording ending — no site content |

## What this confirms vs. what's the correction-prompt's own extrapolation

**Confirmed directly from frames:**
- Percentage-counter preloader with a progress bar and an explicit skip control
- Cursive wordmark + stacked micro-story hero composition (already built)
- A floating "scroll down" affordance in the hero
- A hand-drawn white-stroke line/word drawing itself on a full black scene as a transition device
- Section nav with one active tab highlighted, used for in-page navigation
- Each case study gets its own distinct illustrated "entry" moment rather than uniform cards

**Not visible in the source, but reasonable adaptations already proposed in the correction brief:**
- The exact pinned-scroll-scrubbed mechanics (ScrollTrigger pin/scrub) — the phone-recording can't prove
  this was built with scroll-scrubbing vs. autoplay-on-view; both read similarly on video. Building it
  with scroll-scrubbing (as requested) is the more impressive and controllable choice regardless.
- Paper-panel-opening transitions, split-panel reveals, horizontal Build Lab gallery — plausible in
  style with what's shown (bold panel-based, illustrated, chapter-like) but not individually confirmed
  frame-by-frame. Treated as legitimate stylistic extrapolation, not fabricated as "seen in the video."

## Implementation plan (phased, per your process)

**Phase 1 (this pass):** Preloader with real percentage/skip button, Hero scroll-triggered assembly +
pinned scroll-exit, Contents section pinned with scroll-driven active-item highlighting, a reusable
paper-panel transition component.

**Phase 2+ (subsequent passes, after Phase 1 is verified):** Impact assembly, GitOps pinned case study
with animated pipeline signal, Terraform diagram build-in, Observability SVG line-draw, chapter
interstitial, split-panel reveal, Experience progressive build, Build Lab horizontal gallery, Tech Stack
blueprint animation, Resume paper-drop, Contact finale.

Not doing all of this in one pass — same reasoning as before: each phase gets built, screenshotted,
checked for layout breakage (esp. no clipped/overflowed content, no ScrollTrigger markers left on,
reduced-motion fully readable) before moving to the next.
