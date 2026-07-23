import { caseStudies } from "../data/projects";
import CaseStudyCard from "./CaseStudyCard";

export default function BestWork() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">02 — Best Work</p>
      <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
        The cloud systems and automation projects I am most proud of.
      </h2>

      <div className="mt-10 space-y-6">
        {caseStudies.map((study) => (
          <CaseStudyCard key={study.slug} study={study} />
        ))}
      </div>
    </section>
  );
}
