import { motion, useReducedMotion } from "framer-motion";

const STAGES = ["Commit", "CI", "Security", "Registry", "ArgoCD", "Kubernetes", "Monitoring"];

export default function PipelineStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative w-full overflow-x-auto pb-2" aria-hidden="true">
      <div className="relative flex min-w-[640px] items-center justify-between gap-2 px-2 py-8">
        <div className="absolute left-2 right-2 top-1/2 h-px -translate-y-1/2 bg-white/15" />

        {!reduceMotion && (
          <motion.div
            className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_12px_2px_rgba(201,255,61,0.7)]"
            initial={{ left: "0%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        )}

        {STAGES.map((stage) => (
          <div key={stage} className="relative z-10 flex flex-col items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full border-2 border-blue bg-navy" />
            <span className="font-mono text-[11px] uppercase tracking-wide text-muted whitespace-nowrap">
              {stage}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-1 text-center font-mono text-[10px] text-muted/70 sm:hidden">
        ⇄ scroll to see the full pipeline
      </p>
    </div>
  );
}
