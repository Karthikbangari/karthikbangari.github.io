import { useRef, useEffect } from "react";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "../lib/motion";

const LINES = ["modules/", "├── vpc", "├── eks", "├── rds", "├── s3", "└── iam"];

const ANNOTATIONS = [
  { text: "Private traffic", rotate: "-3deg" },
  { text: "Reusable module", rotate: "2deg" },
  { text: "Secret stays outside Git", rotate: "-2deg" },
  { text: "Multi-AZ", rotate: "3deg" },
  { text: "State locked", rotate: "-1.5deg" },
];

export default function ModuleTree() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const noteRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(lineRefs.current, { autoAlpha: 0, x: -10 });
      gsap.set(noteRefs.current, { autoAlpha: 0, y: 8 });

      gsap
        .timeline({ scrollTrigger: { trigger: wrapRef.current, start: "top 85%", once: true } })
        .to(lineRefs.current, { autoAlpha: 1, x: 0, duration: 0.2, stagger: 0.15 }, 0)
        .to(noteRefs.current, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.12 }, 0.6);
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
      <pre className="rounded-sm bg-navy px-4 py-3 font-mono text-xs text-signal">
        {LINES.map((line, i) => (
          <div key={line} ref={(el) => (lineRefs.current[i] = el)}>
            {line}
          </div>
        ))}
      </pre>
      <div className="flex flex-wrap gap-3">
        {ANNOTATIONS.map((note) => (
          <span
            key={note.text}
            ref={(el) => (noteRefs.current[ANNOTATIONS.indexOf(note)] = el)}
            style={{ transform: `rotate(${note.rotate})` }}
            className="rounded-sm bg-cream px-2.5 py-1 font-note text-sm text-navy shadow-[0_4px_10px_rgba(12,12,12,0.15)]"
          >
            {note.text}
          </span>
        ))}
      </div>
    </div>
  );
}
