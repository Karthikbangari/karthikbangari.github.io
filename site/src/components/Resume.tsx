import { Award, Download, ExternalLink } from "lucide-react";
import { links } from "../data/links";

export default function ResumeSection() {
  return (
    <section id="resume" className="bg-cream px-6 py-24 text-navy">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue">
        Certification &amp; Resume
      </p>
      <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold sm:text-5xl">
        Evidence, not just claims.
      </h2>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="-rotate-1 rounded-sm bg-paper p-7 shadow-[0_14px_32px_rgba(12,12,12,0.15)]">
          <Award className="text-blue" size={24} />
          <h3 className="mt-3 font-display text-xl font-semibold text-navy">
            HashiCorp Certified: Terraform Associate (2026)
          </h3>
          <p className="mt-2 text-sm text-muted-ink">Verification available on request.</p>
        </div>

        <div className="rotate-1 rounded-sm bg-paper p-7 shadow-[0_14px_32px_rgba(12,12,12,0.15)]">
          <Download className="text-blue" size={24} />
          <h3 className="mt-3 font-display text-xl font-semibold text-navy">Resume</h3>
          <p className="mt-2 text-sm text-muted-ink">
            Full experience, tools and education, in one PDF.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
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
