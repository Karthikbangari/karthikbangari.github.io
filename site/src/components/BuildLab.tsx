import { ExternalLink, Github } from "lucide-react";
import { featuredBuild, labProjects } from "../data/lab";

const NOTE_ROTATIONS = ["-2deg", "1.5deg", "-1deg", "2deg", "-2.5deg", "1deg"];

export default function BuildLab() {
  return (
    <section
      id="lab"
      className="relative overflow-hidden bg-gradient-to-br from-blue to-deep-blue px-6 py-24 text-paper"
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">04 — Build Lab</p>
      <h2 className="mt-4 font-display text-5xl font-bold sm:text-6xl lg:text-7xl">
        After Hours:
        <br />
        Build Lab
      </h2>
      <p className="mt-4 max-w-xl font-note text-xl text-paper/90">
        Open-source tools and technical experiments outside of production work.
      </p>

      <div className="relative mx-auto mt-14 max-w-5xl rounded-sm bg-paper p-6 text-navy shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-10">
        <span className="rounded-full bg-navy px-3 py-1 font-mono text-xs text-signal">
          {featuredBuild.tagline}
        </span>
        <h3 className="mt-4 font-display text-3xl font-bold text-navy sm:text-4xl">
          {featuredBuild.name}
        </h3>
        <p className="mt-3 max-w-2xl text-sm text-muted-ink">{featuredBuild.description}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {featuredBuild.features.map((f) => (
            <li
              key={f}
              className="rounded-full border border-navy/15 px-3 py-1 font-mono text-xs text-muted-ink"
            >
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href={featuredBuild.chromeStoreUrl || "#"}
            aria-disabled={!featuredBuild.chromeStoreUrl}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-sm ${
              featuredBuild.chromeStoreUrl
                ? "bg-blue text-paper"
                : "border border-navy/20 text-muted-ink"
            }`}
          >
            <ExternalLink size={14} />
            {featuredBuild.chromeStoreUrl ? "Chrome Web Store" : "Live — link on request"}
          </a>
          <a
            href={featuredBuild.repo || "#"}
            aria-disabled={!featuredBuild.repo}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-sm ${
              featuredBuild.repo ? "border border-navy/30 text-navy" : "border border-navy/20 text-muted-ink"
            }`}
          >
            <Github size={14} />
            {featuredBuild.repo ? "Repository" : "Link on request"}
          </a>
        </div>
      </div>

      <div className="relative mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-6">
        {labProjects.map((project, i) => (
          <div
            key={project.name}
            className="w-full max-w-xs rounded-sm bg-cream p-5 text-navy shadow-[0_12px_28px_rgba(0,0,0,0.25)]"
            style={{ transform: `rotate(${NOTE_ROTATIONS[i % NOTE_ROTATIONS.length]})` }}
          >
            <h3 className="font-display text-base font-semibold text-navy">{project.name}</h3>
            <p className="mt-2 text-sm text-muted-ink">{project.what}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-navy/15 px-2 py-0.5 font-mono text-[11px] text-muted-ink"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-3 font-note text-blue">{project.status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
