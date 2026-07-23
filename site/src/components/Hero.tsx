import { Github, Linkedin, ArrowRight, FileDown } from "lucide-react";
import { profile } from "../data/profile";
import { links } from "../data/links";
import PipelineStrip from "./PipelineStrip";

export default function Hero() {
  return (
    <section id="top" className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">{profile.eyebrow}</p>

      <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
        {profile.headline}
      </h1>

      <p className="mt-6 max-w-xl text-base text-muted sm:text-lg">{profile.subhead}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {profile.badges.map((badge) => (
          <span
            key={badge}
            className="rounded-full border border-white/15 px-3 py-1 font-mono text-xs text-muted"
          >
            {badge}
          </span>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <a
          href="#work"
          className="flex items-center gap-2 rounded-full bg-blue px-5 py-3 font-mono text-sm font-medium text-white transition-transform hover:scale-[1.03]"
        >
          View Best Work
          <ArrowRight size={16} />
        </a>
        <a
          href={links.resume}
          className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 font-mono text-sm font-medium text-paper transition-colors hover:border-signal hover:text-signal"
        >
          <FileDown size={16} />
          Download Resume
        </a>
        <a
          href={links.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="text-muted hover:text-paper transition-colors"
        >
          <Github size={20} />
        </a>
        <a
          href={links.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="text-muted hover:text-paper transition-colors"
        >
          <Linkedin size={20} />
        </a>
      </div>

      <p className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-signal">
        <span className="h-1.5 w-1.5 rounded-full bg-signal" />
        {profile.availability}
      </p>

      <div className="mt-16 rounded-2xl border border-white/10 bg-surface/60 p-4">
        <PipelineStrip />
      </div>
    </section>
  );
}
