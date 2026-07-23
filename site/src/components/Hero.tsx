import { Github, Linkedin, ArrowRight, FileDown } from "lucide-react";
import { profile } from "../data/profile";
import { links } from "../data/links";
import PipelineStrip from "./PipelineStrip";
import StickyNote from "./StickyNote";
import HandDrawnArrow from "./HandDrawnArrow";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-blue px-6 pb-16 pt-28 text-paper"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
              {profile.eyebrow}
            </p>
            <div className="relative hidden shrink-0 lg:block">
              <HandDrawnArrow
                color="#F4F1E8"
                flip
                className="pointer-events-none absolute -bottom-10 -left-16 h-14 w-20 rotate-[100deg]"
              />
              <StickyNote rotate="3deg" className="w-48 text-xs">
                Fastest way to know me → Best Work
              </StickyNote>
            </div>
          </div>

          <h1 className="mt-5 max-w-xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {profile.headline}
          </h1>

          <p className="mt-6 max-w-lg text-base text-paper/90 sm:text-lg">{profile.subhead}</p>

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

          <div className="relative mt-9 flex flex-wrap items-center gap-4">
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

          <p className="mt-8 inline-flex items-center gap-2 font-mono text-xs text-signal">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            {profile.availability}
          </p>
        </div>

        <div className="relative z-0 flex items-center justify-center lg:justify-end">
          <span
            aria-hidden="true"
            className="pointer-events-none select-none whitespace-nowrap font-hand text-[7rem] leading-none text-paper/15 sm:text-[9rem] lg:text-[10rem]"
          >
            karthik
          </span>
          <div className="absolute h-40 w-40 overflow-hidden rounded-full border-4 border-paper/30 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:h-56 sm:w-56">
            <img
              src={profile.photo}
              alt="Karthik Bangari"
              className="h-full w-full object-cover"
              width={224}
              height={224}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-16 w-full max-w-6xl rounded-2xl border border-navy/20 bg-navy/80 p-4">
        <PipelineStrip />
      </div>
    </section>
  );
}
