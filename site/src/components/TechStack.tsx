import { skillGroups } from "../data/skills";

export default function TechStack() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">Technology Stack</p>
      <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
        Organised by responsibility, not a logo wall.
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <div key={group.group} className="rounded-2xl border border-white/10 bg-surface/60 p-6">
            <h3 className="font-display text-lg font-semibold text-paper">{group.group}</h3>
            <ul className="mt-4 space-y-4">
              {group.skills.map((skill) => (
                <li key={skill.name}>
                  <div className="font-mono text-sm font-medium text-blue-light">{skill.name}</div>
                  <p className="mt-0.5 text-xs text-muted">{skill.example}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
