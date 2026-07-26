# Motion Analysis — dense re-pass (0.25s/4fps sampling)

Source: same file as before — `ScreenRecording_07-16-2026 19-06-10_1.MP4` (30.97s). No file named
`...1(2).MP4` exists anywhere on disk (checked Downloads, references/, full filesystem search); the
"(2)" in the latest prompt is almost certainly a re-upload artifact, not a different recording.
Re-extracted at 4fps for the 4 requested ranges: `animation-analysis/dense/`, contact sheets at
`animation-analysis/contact-{4,10,16,22}s.jpg`.

## Confirmed directly from frames (this pass)

| Time (approx) | What's actually visible |
|---|---|
| 4.0–8.6s | Preloader: blue bg, "I ___ Intentionally" / "make ___ Misalignment/Intentional." / "look ___ Intentional.", percentage climbing 34→45→49→68→81→88→94→97%, progress bar, "Skip Animation" button |
| 8.6–9.7s | Cursive "baaz" wordmark holds on blue (long hold, ~4-5s of screen time) |
| ~9.7–9.9s | A brief blurry moment with pale/white rectangular shapes — too motion-blurred and low-res to confirm as "two cream panels"; could equally be scroll-motion blur of the hero page itself finishing assembly. My earlier hi-res grab at t=9.0s already showed the **complete** hero (wordmark + micro-story stack + "Go on, scroll down" cue + bottom pill nav) — i.e. by 9s the hero is already fully formed. There isn't clear evidence of a separate "paper gate opens to reveal a *different* About page" here; more likely this is just the tail of the intro dissolving into the already-built hero. |
| ~9.9–15.3s | **Correction to my last analysis**: I previously read this as an unrelated Instagram reel ("I started making creative stuff... sneakers", "33M+ views", "DU RANK 1"). Looking again with denser sampling, this is more likely a **Best Work project card** — a case study about a creator/client named "Krishna Shukla," embedding that creator's own clip as evidence within the case study, alongside stat callouts (33M+, DU Rank 1) as the project's own result metrics. **This is NOT an "About/Origin" page** — there's no visible story-of-Karthik/Bajkamal content here at all, just this one client project's material. |
| ~15.3–16.0s | Black screen, white hand-drawn line/signature drawing itself (confirmed real, matches earlier pass) |
| ~16.0–17.6s | Blue screen, Hindi text "दिल्ली मेट्रो में आपका स्वागत है / Welcome to Delhi Metro" |
| ~17.6–18.2s | Two blue panels meet at a centre seam and split apart horizontally — **this is a real, confirmable center-split-doors transition** |
| ~18.2–24.5s | "Best Work" sticker + "NORTH CAMPUS" (Delhi Metro-themed project) card, then transitions to the "Krishna Shukla" card (same one seen at 9.9–15.3s — so that segment belongs *inside* Best Work, not before it) |
| ~24.5–25.0s | Brief blur/transition |
| ~25.0–25.6s | **"Insomniac Work" title card** on blue — confirms this section name is real (also matches the reference PDF pages reviewed earlier) |
| ~25.6–29s | **Contact finale**: "Contact" in blue overlapping "Me" in cream/white, "say hi before overthinking it," name credit, consistent with what's already built |

## What this means for the new prompt's "EXACT REFERENCE MOTION MAP"

Some of it is now independently confirmed: the percentage preloader, the cursive-logo hold, the
black hand-drawn line, and — genuinely new and worth building — **the center-split blue doors are
real** (I hadn't confirmed that specific mechanic before this denser pass). "Insomniac Work" as a
distinct interstitial is also now directly confirmed on-frame, not just from the earlier PDF.

But the specific claim of a **separate 9.8–15.2s "About/Origin" horizontal canvas** doesn't hold up —
that time range is Best Work project content (the Krishna Shukla case study), not an origin story.
And I still can't verify the frame-precise mechanics the new prompt specifies (exact `xPercent`
values, a "300vw canvas," decisecond-accurate transition boundaries, "panels 42–48vw wide," etc.) —
this remains a shaky, secondhand phone recording of someone scrolling their own Instagram feed, not
a clean screen capture. Given how directly this correction reshapes the *previous* prompt's account
too, I read the level of precision in these prompts as a plausible-sounding reconstruction layered on
top of real but blurry footage, not literal frame-by-frame ground truth — worth naming plainly
rather than pretending false precision.
