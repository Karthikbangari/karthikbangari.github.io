import { Github, Linkedin, Mail, FileDown, ArrowRight, Award } from "lucide-react";
import { links } from "../../data/links";
import { profile } from "../../data/profile";

export type ContactRefId = "wordmark" | "cue" | "links" | "footerBar" | "signature";

export default function ContactScene({
  registerRef,
}: {
  registerRef: (id: ContactRefId, el: HTMLElement | null) => void;
}) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-black pb-16 text-paper">
      <div className="relative flex flex-1 items-center justify-center px-10">
        <div className="flex flex-col items-center gap-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">06 — Contact</p>

          <div ref={(el) => registerRef("wordmark", el)} className="flex items-center">
            <span className="font-display text-6xl font-bold text-blue sm:text-8xl">Contact</span>
            <span className="-ml-4 font-hand text-6xl text-paper sm:text-8xl">Me</span>
          </div>

          <p
            ref={(el) => registerRef("cue", el)}
            className="flex items-center gap-2 font-mono text-sm text-signal"
          >
            <ArrowRight size={16} />
            say hi before overthinking it
          </p>

          <div
            ref={(el) => registerRef("links", el)}
            className="flex flex-wrap items-center justify-center gap-5 font-mono text-xs text-paper/80"
          >
            <a href={links.email} className="flex items-center gap-1.5 hover:text-signal">
              <Mail size={14} />
              Email
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-signal"
            >
              <Linkedin size={14} />
              LinkedIn
            </a>
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-signal"
            >
              <Github size={14} />
              GitHub
            </a>
            <a href={links.resume} className="flex items-center gap-1.5 hover:text-signal">
              <FileDown size={14} />
              Resume
            </a>
            <span className="flex items-center gap-1.5 text-blue-light">
              <Award size={14} />
              Terraform Associate (2026)
            </span>
          </div>
        </div>
      </div>

      <div ref={(el) => registerRef("footerBar", el)} className="bg-cream px-10 py-6 text-navy">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-ink">
            Bye, have a great day at your job. Hoping you get fewer boring portfolios to review.
          </p>
          <p ref={(el) => registerRef("signature", el)} className="font-hand text-2xl text-blue">
            {profile.name}
          </p>
        </div>
      </div>
    </div>
  );
}