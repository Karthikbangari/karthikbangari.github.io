import { Github, Linkedin, ArrowRight, FileDown } from "lucide-react";
import { profile } from "../data/profile";
import { links } from "../data/links";
import PipelineStrip from "./PipelineStrip";
import StickyNote from "./StickyNote";
import HandDrawnArrow from "./HandDrawnArrow";

const MICRO_STORY = [
  { label: "Started as", value: "Junior DevOps Engineer" },
  { label: "Became", value: "DevOps Engineer" },
  { label: "Building toward", value: "Platform / SRE Engineering" },
];

function ReliabilityGraph() {
  return (
    <svg viewBox="0 0 160 60" className="h-12 w-40" aria-hidden="true">
      <polyline
        points="4,52 30,44 52,48 76,28 100,32 124,12 156,6"
        fill="none"
        stroke="#C8FF22"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="156" cy="6" r="4" fill="#C8FF22" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gradient-to-br from-blue to-deep-blue px-6 pb-12 pt-24 text-paper"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
              {profile.eyebrow}
            </p>
            <div className="relative hidden shrink-0 lg:block">
              <HandDrawnArrow
                color="#FFFDF7"
                flip
                className="pointer-events-none absolute -bottom-10 -left-16 h-14 w-20 rotate-[100deg]"
              />
              <StickyNote rotate="3deg" className="w-48 text-xs">
                Fastest way to know me → Best Work
              </StickyNote>
            </div>
          </div>

          <h1 className="mt-5 max-w-2xl font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
            {profile.headline}
          </h1>

          <p className="mt-6 max-w-lg text-base text-paper/90 sm:text-lg">{profile.subhead}</p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-y border-paper/20 py-4">
            {MICRO_STORY.map((step) => (
              <div key={step.label}>
                <p className="font-mono text-[11px] uppercase tracking-wider text-paper/70">
                  {step.label}
                </p>
                <p className="font-display text-base font-semibold text-paper sm:text-lg">
                  {step.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {profile.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-paper/30 px-3 py-1 font-mono text-xs text-paper"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="relative mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="flex items-center gap-2 rounded-full bg-signal px-5 py-3 font-mono text-sm font-semibold text-navy transition-transform hover:scale-[1.03]"
            >
              View Best Work
              <ArrowRight size={16} />
            </a>
            <a
              href={links.resume}
              className="flex items-center gap-2 rounded-full border border-paper/40 px-5 py-3 font-mono text-sm font-medium text-paper transition-colors hover:border-signal hover:text-signal"
            >
              <FileDown size={16} />
              Download Resume
            </a>
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-paper/80 hover:text-signal transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-paper/80 hover:text-signal transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>

          <p className="mt-7 inline-flex items-center gap-2 font-mono text-xs text-signal">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            {profile.availability}
          </p>
        </div>

        <div className="relative z-0 flex flex-col items-center gap-4 lg:items-end">
          <div className="relative flex items-center justify-center">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute select-none whitespace-nowrap font-hand text-[8rem] leading-none text-paper/20 sm:text-[10rem] lg:right-0 lg:text-[11rem]"
            >
              karthik
            </span>
            <div className="relative h-44 w-44 overflow-hidden rounded-full border-4 border-paper/40 shadow-[0_25px_70px_rgba(0,0,0,0.4)] sm:h-60 sm:w-60">
              <img
                src={profile.photo}
                alt="Karthik Bangari"
                className="h-full w-full object-cover grayscale contrast-125"
                width={240}
                height={240}
              />
              <div className="pointer-events-none absolute inset-0 bg-blue mix-blend-color" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 lg:items-end">
            <ReliabilityGraph />
            <p className="font-mono text-[11px] tracking-wide text-paper/70">
              AWS · Kubernetes · Terraform · GitOps
            </p>
          </div>

          <div className="mt-2 -rotate-2 rounded-sm bg-cream px-4 py-2 font-note text-sm text-navy shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
            Portfolio // Karthik Bangari
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-12 w-full max-w-6xl rounded-2xl border border-navy/20 bg-navy/80 p-4">
        <PipelineStrip />
      </div>
    </section>
  );
}
