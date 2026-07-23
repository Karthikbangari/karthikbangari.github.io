# Portfolio Upgrade Plan

Branch: `portfolio-redesign` (created from `main`)
Live URL to preserve: https://karthikbangari.github.io/

## 1. Current architecture

- This is a GitHub user Pages site (`Karthikbangari/karthikbangari.github.io`). Pages serves whatever is committed at the **repo root of `main`** directly — there is no `.github/workflows` file, no root `package.json`, and no build step in CI. Publishing today means: build somewhere, copy the output into the repo root, commit, push to `main`.
- Root [index.html](index.html) is a thin HTML shell. It loads:
  - `assets/index-CSsQFZi4.js` + `assets/index-DrmTp9Or.css` — a minified, hashed Vite production bundle (428 KB JS). This is the main app: **"Karthik Valley OS,"** a Pixar-style animated 3D countryside portfolio (per its `<title>`/`<meta>` tags).
  - `assets/valley-polish.css`, `assets/premium-upgrade.{js,css}`, `assets/premium-games.{js,css}`, `assets/premium-skills.{js,css}` — hand-written vanilla-JS "patch" scripts that wait for the React root to mount (`waitForApp` polling) and then bolt on extra DOM/behavior.
  - `assets/cicd-pipeline/cicd-pipeline.{js,css}` — a separately built embeddable widget (a 3D CI/CD pipeline visualization built with React Three Fiber) that self-mounts into a slot in the Valley OS page.
- [pipeline-app/](pipeline-app/) is the **only real, buildable source in this repo**: a Vite + React + TypeScript + Three.js/R3F project whose `vite.config.ts` builds directly to `../assets/cicd-pipeline/` with stable filenames. `npm run typecheck` and `npm run build` both pass cleanly as of this audit.
- **Critical finding:** the source for the main Valley OS bundle (`index-CSsQFZi4.js`) does not exist anywhere in this repository. Only its compiled, minified output was ever committed. It cannot be "improved in place" — there is nothing to edit. Any change to the hero/main app means writing new source from scratch, not modifying existing code.
- No `references/` folder exists yet, and none of the three files it should contain (CV PDF, reference portfolio PDF, screen recording) have been added.
- Local `main` is currently 16 commits ahead of `origin/main` (unpushed, pre-existing — unrelated to this work).

## 2. Current technology stack

| Piece | Stack |
|---|---|
| Root site | Static HTML + prebuilt JS/CSS, no source, no bundler config |
| `pipeline-app` (CI/CD widget) | Vite 5, React 18, TypeScript, Three.js, @react-three/fiber, @react-three/drei, GSAP, Framer Motion, lucide-react |
| Deployment | GitHub Pages serving `main` branch root directly, no Actions workflow |
| Fonts | Google Fonts: JetBrains Mono, Sora, Plus Jakarta Sans |

## 3. Existing strengths (KEEP)

- The CI/CD pipeline 3D widget (`pipeline-app`) is real, working, type-checked source under version control — unlike the rest of the site. It already tells a "GitOps delivery" story with an artifact traveling through pipeline stations, which is conceptually close to Case Study 01 in the new plan.
- Deployment mechanics (Pages serving root of `main`, no workflow to break) are simple and low-risk to keep.
- `favicon.svg` and the Google Fonts choices (Sora / Plus Jakarta Sans for display, JetBrains Mono for technical text) are reusable — they already match the "modern sans + monospace" direction requested.
- `assets/karthik-B1T4_5iR.jpg` (profile photo) is a real asset worth reusing if it's a genuine headshot.

## 4. Existing weaknesses (REPLACE / REMOVE)

- **Whole-site theme mismatch**: "Karthik Valley OS" is a countryside/Pixar/gamified concept. Per your explicit direction, this is being replaced by a premium technical/editorial DevOps identity — it does not fit a recruiter-facing 60-second read.
- **No source for the main bundle** — can't "improve," must rebuild. Classified REPLACE.
- **3D CI/CD pipeline widget** — per your earlier decision, this is being **removed** (Three.js/R3F is heavy, "constant animation" conflicts with the new plan's motion rules, and the new plan replaces it with a lighter architecture-diagram treatment). `pipeline-app/` and `assets/cicd-pipeline/` will be deleted once the new Case Study 01 has an equivalent diagram.
- **`premium-games.js/css`** — filename suggests a gamified feature; need to check content before final call, but conceptually conflicts with the recruiter-focused, non-gamified direction. Tentatively REMOVE.
- **No resume file anywhere in the repo** — recruiters currently cannot download a CV from this site at all. This is a hard blocker for the "Download Resume" CTA the plan requires everywhere.
- **No README** documenting stack/build/deploy — to be added in Phase 8.

## 5. Components that will be preserved

- GitHub Pages deployment target (same URL, same root-serving mechanism).
- Repo identity/history — no new repo, no nested project.
- Font choices (Sora/Plus Jakarta Sans/JetBrains Mono), favicon, profile photo (pending content review).
- `pipeline-app`'s build tooling *pattern* (Vite + TS, embeddable widget built to a stable path) is a reasonable template for how the new site's source should be organized, even though the widget itself is being removed.

## 6. Components that will be redesigned

- Everything currently rendered by `index-CSsQFZi4.js` (hero, nav, all sections) — rebuilt from scratch as the new 10-section one-page DevOps portfolio, per your earlier decision using **React + Vite**, with build output committed to the repo root (same pattern `pipeline-app` already uses, applied to the whole site).
- `premium-skills.*` → becomes the new "Technology Stack" section (grouped by responsibility, hover examples).
- `premium-upgrade.*` → superseded by the new design system (colors/typography/motion) described in your brief.

## 7. Components that will be removed

- `pipeline-app/` directory and its build output `assets/cicd-pipeline/` (per your decision — replaced by a lightweight SVG/CSS architecture diagram in Case Study 01).
- `assets/premium-games.{js,css}` — reviewed: this is a "Production Incident Simulator" mini-game (click-through steps like "Provision Infrastructure," "Run CI/CD Pipeline" with fake before/after stats). It reuses your real metrics but wraps them in a gamified interaction, which the new brief explicitly rules out ("must not look like a gaming website"). Confirmed REMOVE — its real metrics are preserved in the new Impact Dashboard instead.
- Old minified bundle `assets/index-CSsQFZi4.js` / `assets/index-DrmTp9Or.css` and `assets/valley-polish.css` once the new build replaces them.

## 8. Content changes

- Replace all Valley OS copy/metaphors with the DevOps positioning from your brief (hero copy, impact metrics, 3 case studies, experience timeline, Build Lab, contact).
- **Blocked** on real assets: resume PDF, project screenshots, repo/demo links, certificate verification links, Git File Explainer store link. Per your instruction, these must be collected before content is finalized (see §12).
- `references/` folder (CV PDF, reference portfolio PDF, screen recording) will be used only as **design/content input** during development and must be `.gitignore`d so it's never deployed or exposed publicly.

## 9. Animation changes

- Drop Three.js/R3F entirely (with the pipeline widget removal).
- Terminal-intro, metric counters, SVG pipeline/arch diagrams, scroll reveals — implemented with lightweight CSS/SVG + a small motion helper (Framer Motion or CSS, decided at build time), all `prefers-reduced-motion`-aware, none blocking navigation or scroll.

## 10. Responsive changes

- New build will be tested at the breakpoints listed in your brief (375–1920px); current site's mobile behavior can't be assessed meaningfully since it's being replaced wholesale.

## 11. Accessibility changes

- Semantic landmarks, skip-link, keyboard nav, visible focus states, alt text, reduced-motion support — none of this exists to preserve in the current minified bundle, so it's built in fresh rather than retrofitted.

## 12. Deployment risks

- **Must not break the live URL.** Since Pages serves `main` root directly, the new build's output must land at repo root with root-relative asset paths (no repo-name base path — this is a user Pages site, not a project Pages site).
- Work happens on `portfolio-redesign` branch; **merging to `main` and pushing will go live immediately** (no staging environment) — I will confirm with you explicitly before that merge/push.
- `references/` folder must be excluded via `.gitignore` so the CV/PDF/video are never accidentally committed or deployed.
- Local `main` is 16 commits ahead of `origin/main` (unpushed) — unrelated pre-existing state, flagged so it isn't confused with new work; will not be touched.
- Removing `pipeline-app/` deletes real, working, type-checked code — reversible via git history, but confirming before deletion since it's a deliberate scope cut, not a bug fix.

## 13. Blocker: missing reference assets

Per your instructions, the following are needed under `references/` (git-ignored) before content/design phases can use them, and none exist yet:

- `references/Karthik_Bangari_DevOps_CV_EU.pdf`
- `references/Portfolio II Bajkamal Singh II SRCC.pdf`
- `references/ScreenRecording_07-16-2026 19-06-10_1.MP4`

Also needed at some point before final content lock (not blocking early structural/design-system work):
- A public-facing resume filename/file to actually ship (`Karthik_Bangari_DevOps_CV.pdf`)
- Screenshots for the 3 case studies + Git File Explainer
- Real repo/demo URLs
- Terraform Associate certificate verification link

## 14. Step-by-step implementation checklist

- [x] Audit repository (this document)
- [x] Confirm `pipeline-app` typechecks and builds cleanly (before removal)
- [x] Create `portfolio-redesign` branch
- [ ] **You add the 3 files to `references/`** (still not blocking further code work, but blocking real content verification)
- [x] Add `references/` to `.gitignore` (and `.claude/`, the local tool-permissions cache)
- [x] Review `premium-games.*` content — confirmed REMOVE (gamified "Production Incident Simulator," off-brand)
- [x] Phase 2: centralize content (`site/src/data/{profile,metrics,experience,projects,skills,links,navigation,lab}.ts`)
- [x] Phase 3: design system (Tailwind palette/fonts, `site/src/styles/index.css`, reduced-motion + focus-visible + skip-link baked in)
- [x] Phase 4: homepage sections, built section-by-section — Hero/QuickNav/ImpactDashboard, then About/Experience, then Best Work (3 case studies), then BuildLab/TechStack/Resume/Contact/Footer
- [x] Phase 5: case-study template (expand/collapse) applied to all 3 case studies + Git File Explainer in Build Lab
- [x] Phase 6: motion pass — terminal intro, pipeline strip, count-up metrics, all `prefers-reduced-motion`-aware; verified via real headless-Chromium runs (desktop + mobile) with zero console errors at every batch
- [x] Phase 6b: polish pass — fixed a real WCAG AA contrast failure (`text-blue` on dark backgrounds, 3.64:1 → new `blue-light` token, 5.18:1+), verified keyboard tab order + reduced-motion behavior live, added mobile scroll-affordance hint on the pipeline strip, added OG/Twitter/canonical/robots.txt/sitemap.xml/Person JSON-LD (JSON-LD only includes the GitHub URL, since it's verified against this repo's own git remote — LinkedIn stays out of machine-readable data until confirmed)
- [x] **Cutover**: deleted old Valley OS bundle, `pipeline-app/`, `premium-games.*`, `premium-skills.*`, `valley-polish.css`; ran the real `site` production build to repo root; verified the actual built output (not dev mode) in a real browser with zero console errors and zero failed requests
- [ ] Phase 7: remaining QA — lint (no linter configured yet), full link check once real URLs exist
- [ ] Phase 8: README (stack, local dev, build, deploy, content editing)
- [ ] Explicit go-ahead from you before merging `portfolio-redesign` → `main` and pushing (this makes it live) — **not done yet, still local to this branch**

## 15. What's still a placeholder (do not go live without checking)

Every one of these is marked `TODO(real-assets)` in code, not fabricated:
- Resume PDF file itself (not in the repo — `links.resume` points to a path that doesn't resolve yet)
- Contact email (`links.email` is a literal `TODO@example.com`)
- LinkedIn URL (guessed handle, unconfirmed — deliberately excluded from the JSON-LD structured data for this reason)
- Case-study evidence (architecture diagrams, screenshots, redacted configs, repo/demo links) for all 3 Best Work case studies
- Each case study's "what I'd improve next" reflection (needs your real answer, not an invented one)
- Build Lab: Chrome Web Store link + repo link for Git File Explainer; repo/demo/status for the other 6 lab projects
- Terraform Associate certificate verification link + badge image
- OG image is currently your real profile photo as an honest stand-in — a proper 1200×630 banner would look better on social shares
