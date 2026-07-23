import { skillGroups } from "../data/skills";

export default function TechStack() {
  return (
    <section id="skills" className="relative overflow-hidden bg-cream px-6 py-24 text-navy">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue">Technology Stack</p>
      <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold sm:text-5xl">
        The engineering toolbox, not a logo wall.
      </h2>

      <div className="mx-auto mt-14 max-w-5xl divide-y divide-navy/10 border-y border-navy/10">
        {skillGroups.map((group) => (
          <div key={group.group} className="flex flex-col gap-4 py-8 sm:flex-row sm:gap-10">
            <h3 className="w-full shrink-0 font-hand text-3xl text-blue sm:w-48">
              {group.group}
            </h3>
            <ul className="grid flex-1 grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {group.skills.map((skill) => (
                <li key={skill.name}>
                  <div className="font-mono text-sm font-semibold text-navy">{skill.name}</div>
                  <p className="mt-0.5 text-xs text-muted-ink">{skill.example}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
