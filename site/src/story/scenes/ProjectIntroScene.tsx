export type ProjectIntroRefId = "eyebrow" | "headline" | "tagline" | "stack" | "cue";

export default function ProjectIntroScene({
  registerRef,
}: {
  registerRef: (id: ProjectIntroRefId, el: HTMLElement | null) => void;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue to-deep-blue px-10 text-center text-paper">
      <p
        ref={(el) => registerRef("eyebrow", el)}
        className="font-mono text-xs uppercase tracking-[0.2em] text-signal"
      >
        03 — Projects
      </p>
      <h2
        ref={(el) => registerRef("headline", el)}
        className="mt-4 font-display text-5xl font-bold leading-[0.95] sm:text-7xl"
      >
        RELEASES
        <br />
        WITHOUT
        <br />
        THE WAIT.
      </h2>
      <p ref={(el) => registerRef("tagline", el)} className="mt-6 font-note text-xl text-paper/90">
        GitOps Delivery Platform
      </p>
      <p ref={(el) => registerRef("stack", el)} className="mt-2 font-mono text-xs text-paper/70">
        Jenkins · Docker · ArgoCD · EKS
      </p>
      <p
        ref={(el) => registerRef("cue", el)}
        className="mt-8 font-mono text-[11px] uppercase tracking-widest text-paper/50"
      >
        Scroll to enter the case study ↓
      </p>
    </div>
  );
}