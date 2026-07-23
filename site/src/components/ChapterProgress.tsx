import { useEffect, useState } from "react";
import { ensureGsapRegistered, ScrollTrigger, prefersReducedMotion } from "../lib/motion";

const CHAPTERS = [
  { id: "top", label: "Cover" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "lab", label: "Lab" },
  { id: "contact", label: "Contact" },
];

export default function ChapterProgress() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) return;

    // Deliberately NOT using the chapter sections themselves as ScrollTrigger
    // triggers — several (Hero, QuickNav, Impact) are pinned by their own
    // independent ScrollTriggers, and a second trigger measuring the same
    // pinned element is fragile (start/end get computed against the
    // pin-affected position). Instead: precompute each chapter's absolute
    // document offset and compare against scroll position directly.
    let offsets: number[] = [];

    const computeOffsets = () =>
      CHAPTERS.map((c) => {
        const el = document.getElementById(c.id);
        return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
      });

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: () => document.documentElement.scrollHeight,
      onRefresh: () => {
        offsets = computeOffsets();
      },
      onUpdate: () => {
        const y = window.scrollY + window.innerHeight / 2;
        let idx = 0;
        for (let i = 0; i < offsets.length; i++) {
          if (y >= offsets[i]) idx = i;
        }
        setActive(idx);
      },
    });

    offsets = computeOffsets();
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      trigger.kill();
    };
  }, []);

  return (
    <nav
      aria-label="Chapter progress"
      className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 rounded-full bg-navy/70 px-2 py-4 backdrop-blur lg:flex"
    >
      {CHAPTERS.map((chapter, i) => (
        <a
          key={chapter.id}
          href={`#${chapter.id}`}
          className="group flex items-center gap-2"
          aria-current={i === active ? "true" : undefined}
        >
          <span
            className={`font-mono text-[10px] uppercase tracking-wider opacity-0 transition-opacity group-hover:opacity-100 ${
              i === active ? "text-signal opacity-100" : "text-paper/70"
            }`}
          >
            {chapter.label}
          </span>
          <span
            className={`h-2 w-2 rounded-full border transition-all ${
              i === active ? "scale-125 border-signal bg-signal" : "border-paper/50 bg-transparent"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}
