import { Award, Download, ExternalLink } from "lucide-react";
import { links } from "../data/links";

export default function ResumeSection() {
  return (
    <section id="resume" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
        Certification &amp; Resume
      </p>
      <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
        Evidence, not just claims.
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-surface/60 p-6">
          <Award className="text-signal" size={22} />
          <h3 className="mt-3 font-display text-lg font-semibold text-paper">
            HashiCorp Certified: Terraform Associate
          </h3>
          <p className="mt-2 text-sm text-muted">
            {/* TODO(real-assets): add certificate verification link and badge image */}
            Verification link and badge — add once available.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface/60 p-6">
          <Download className="text-blue" size={22} />
          <h3 className="mt-3 font-display text-lg font-semibold text-paper">Resume</h3>
          <p className="mt-2 text-sm text-muted">Full experience, tools and education, in one PDF.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={links.resume}
              download
              className="flex items-center gap-2 rounded-full bg-blue px-4 py-2 font-mono text-xs text-white"
            >
              <Download size={14} />
              Download Resume
            </a>
            <a
              href={links.resume}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-mono text-xs text-paper"
            >
              <ExternalLink size={14} />
              Open Resume
            </a>
          </div>
          {/* TODO(real-assets): resume PDF is not yet in the repo at site/public/resume/ */}
        </div>
      </div>
    </section>
  );
}
