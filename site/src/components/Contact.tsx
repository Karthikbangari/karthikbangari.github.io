import { Github, Linkedin, Mail, FileDown } from "lucide-react";
import { links } from "../data/links";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">05 — Contact</p>
      <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold sm:text-5xl">
        Let's make production boring—in the best possible way.
      </h2>
      <p className="mt-6 max-w-xl text-base text-muted">
        Need help building reliable cloud infrastructure, faster delivery pipelines or observable
        Kubernetes platforms?
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <a
          href={links.email}
          className="flex items-center gap-2 rounded-full bg-blue px-5 py-3 font-mono text-sm font-medium text-white"
        >
          <Mail size={16} />
          Email Karthik
        </a>
        <a
          href={links.linkedin}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 font-mono text-sm text-paper"
        >
          <Linkedin size={16} />
          LinkedIn
        </a>
        <a
          href={links.github}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 font-mono text-sm text-paper"
        >
          <Github size={16} />
          GitHub
        </a>
        <a
          href={links.resume}
          className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 font-mono text-sm text-paper"
        >
          <FileDown size={16} />
          Download Resume
        </a>
      </div>

      <p className="mt-12 font-mono text-sm italic text-muted">
        Say hello before overthinking it.
      </p>
    </section>
  );
}
