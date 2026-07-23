import { ExternalLink, Github } from "lucide-react";
import { featuredBuild, labProjects } from "../data/lab";

export default function BuildLab() {
  return (
    <section id="lab" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">04 — Build Lab</p>
      <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
        After Hours: Build Lab
      </h2>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Open-source tools and technical experiments outside of production work.
      </p>

      <div className="mt-10 rounded-2xl border border-signal/30 bg-surface/60 p-6 sm:p-8">
        <span className="rounded-full border border-signal/40 px-3 py-1 font-mono text-xs text-signal">
          Built by me — idea to release
        </span>
        <h3 className="mt-4 font-display text-2xl font-bold text-paper sm:text-3xl">
          {featuredBuild.name}
        </h3>
        <p className="mt-3 max-w-2xl text-sm text-muted">{featuredBuild.description}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {featuredBuild.features.map((f) => (
            <li
              key={f}
              className="rounded-full border border-white/15 px-3 py-1 font-mono text-xs text-muted"
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
                ? "bg-blue text-white"
                : "cursor-not-allowed border border-dashed border-white/20 text-muted"
            }`}
          >
            <ExternalLink size={14} />
            {featuredBuild.chromeStoreUrl ? "Chrome Web Store" : "Chrome Web Store (add link)"}
          </a>
          <a
            href={featuredBuild.repo || "#"}
            aria-disabled={!featuredBuild.repo}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-sm ${
              featuredBuild.repo
                ? "border border-white/20 text-paper"
                : "cursor-not-allowed border border-dashed border-white/20 text-muted"
            }`}
          >
            <Github size={14} />
            {featuredBuild.repo ? "Repository" : "Repository (add link)"}
          </a>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {labProjects.map((project) => (
          <div key={project.name} className="rounded-2xl border border-white/10 bg-surface/60 p-6">
            <h3 className="font-display text-base font-semibold text-paper">{project.name}</h3>
            <p className="mt-2 text-sm text-muted">{project.what}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span key={t} className="rounded-full border border-white/15 px-2 py-0.5 font-mono text-[11px] text-muted">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-3 font-mono text-[11px] text-muted/70">{project.status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
