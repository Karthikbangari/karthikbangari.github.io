import { useEffect, useRef } from "react";
import { Github, Linkedin, Mail, FileDown, ArrowRight } from "lucide-react";
import { links } from "../data/links";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "../lib/motion";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineMaskRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const headline = headlineMaskRef.current?.firstElementChild as HTMLElement | undefined;
      const linkItems = linksRef.current ? Array.from(linksRef.current.children) : [];

      gsap.set(eyebrowRef.current, { autoAlpha: 0, y: -8 });
      if (headline) gsap.set(headline, { yPercent: 100 });
      gsap.set(bodyRef.current, { autoAlpha: 0, y: 12 });
      gsap.set(linkItems, { autoAlpha: 0, x: 16 });

      gsap
        .timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 60%", once: true } })
        .to(eyebrowRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 0)
        .to(headline || {}, { yPercent: 0, duration: 0.6, ease: "power4.out" }, 0.1)
        .to(bodyRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.35)
        .to(linkItems, { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.08 }, 0.3);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-navy px-6 py-16 text-paper"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p ref={eyebrowRef} className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            05 — Contact
          </p>
          <div ref={headlineMaskRef} className="mt-4 max-w-xl overflow-hidden">
            <h2 className="font-display text-4xl font-bold sm:text-5xl">
              Let's make production boring
              <span className="text-blue-light">—in the best possible way.</span>
            </h2>
          </div>
          <p ref={bodyRef} className="mt-6 max-w-md text-base text-muted">
            Need help building reliable cloud infrastructure, faster delivery pipelines or
            observable Kubernetes platforms?
          </p>
        </div>

        <div ref={linksRef} className="flex flex-col gap-4 font-mono text-sm">
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
    </section>
  );
}
