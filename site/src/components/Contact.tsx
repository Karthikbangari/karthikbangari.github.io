import { Github, Linkedin, Mail, FileDown, ArrowRight } from "lucide-react";
import { links } from "../data/links";
import { profile } from "../data/profile";

export default function Contact() {
  return (
    <section
      id="contact"
      className="flex min-h-screen flex-col justify-between bg-black px-6 py-16 text-paper"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            05 — Contact
          </p>
          <h2 className="mt-4 max-w-xl font-display text-4xl font-bold sm:text-5xl">
            Let's make production boring
            <span className="text-blue-light">—in the best possible way.</span>
          </h2>
          <p className="mt-6 max-w-md text-base text-muted">
            Need help building reliable cloud infrastructure, faster delivery pipelines or
            observable Kubernetes platforms?
          </p>
        </div>

        <div className="flex flex-col gap-4 font-mono text-sm">
          <span className="flex items-center gap-2 text-paper">
            <ArrowRight size={16} className="text-signal" />
            say hi before overthinking it
          </span>
          <a href={links.email} className="flex items-center gap-2 hover:text-signal">
            <Mail size={16} />
            Email
          </a>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-signal"
          >
            <Linkedin size={16} />
            LinkedIn
          </a>
          <a
            href={links.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-signal"
          >
            <Github size={16} />
            GitHub
          </a>
          <a href={links.resume} className="flex items-center gap-2 hover:text-signal">
            <FileDown size={16} />
            Download Resume
          </a>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Bye, have a great day. Hoping this convinced you I'm worth an interview.
        </p>
        <p className="font-hand text-3xl text-paper">{profile.name}</p>
      </div>
    </section>
  );
}
