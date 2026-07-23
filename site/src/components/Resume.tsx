import { useEffect, useRef } from "react";
import { Award, Download, ExternalLink } from "lucide-react";
import { links } from "../data/links";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "../lib/motion";

export default function ResumeSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const certRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const downloadBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(certRef.current, { autoAlpha: 0, x: -80, rotate: -8 });
      gsap.set(resumeRef.current, { autoAlpha: 0, x: 80, rotate: 8 });

      gsap
        .timeline({ scrollTrigger: { trigger: wrapRef.current, start: "top 80%", once: true } })
        .to(certRef.current, { autoAlpha: 1, x: 0, rotate: -1, duration: 0.5, ease: "power3.out" }, 0)
        .to(resumeRef.current, { autoAlpha: 1, x: 0, rotate: 1, duration: 0.5, ease: "power3.out" }, 0.15)
        .fromTo(
          downloadBtnRef.current,
          { scale: 1 },
          { scale: 1.08, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" },
          0.75,
        );
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="resume" className="relative overflow-hidden bg-cream px-6 py-24 text-navy">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue">
        Certification &amp; Resume
      </p>
      <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold sm:text-5xl">
        Evidence, not just claims.
      </h2>

      <div ref={wrapRef} className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
        <div
          ref={certRef}
          className="-rotate-1 rounded-sm bg-paper p-7 shadow-[0_14px_32px_rgba(12,12,12,0.15)]"
        >
          <Award className="text-blue" size={24} />
          <h3 className="mt-3 font-display text-xl font-semibold text-navy">
            HashiCorp Certified: Terraform Associate (2026)
          </h3>
          <p className="mt-2 text-sm text-muted-ink">Verification available on request.</p>
        </div>

        <div
          ref={resumeRef}
          className="rotate-1 rounded-sm bg-paper p-7 shadow-[0_14px_32px_rgba(12,12,12,0.15)]"
        >
          <Download className="text-blue" size={24} />
          <h3 className="mt-3 font-display text-xl font-semibold text-navy">Resume</h3>
          <p className="mt-2 text-sm text-muted-ink">
            Full experience, tools and education, in one PDF.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              ref={downloadBtnRef}
              href={links.resume}
              download
              className="flex items-center gap-2 rounded-full bg-blue px-4 py-2 font-mono text-xs text-paper"
            >
              <Download size={14} />
              Download Resume
            </a>
            <a
              href={links.resume}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-navy/20 px-4 py-2 font-mono text-xs text-navy"
            >
              <ExternalLink size={14} />
              Open Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
