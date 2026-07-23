import { caseStudies } from "../data/projects";
import CaseStudyCard from "./CaseStudyCard";

export default function BestWork() {
  return (
    <div id="work">
      <section className="flex min-h-[70vh] flex-col justify-center bg-gradient-to-br from-blue to-deep-blue px-6 py-20 text-paper">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            02 — Best Work
          </p>
          <h2 className="mt-4 font-display text-6xl font-bold sm:text-7xl lg:text-8xl">
            Best Work
          </h2>
          <p className="mt-4 font-note text-2xl text-paper/90">
            The systems I am most proud of.
          </p>

          <ul className="mt-10 flex flex-col gap-2 font-mono text-sm text-paper/80">
            {caseStudies.map((study) => (
              <li key={study.slug}>
                <a href={`#${study.slug}`} className="hover:text-signal">
                  {study.index} {study.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {caseStudies.map((study) => (
        <CaseStudyCard key={study.slug} study={study} />
      ))}
    </div>
  );
}
