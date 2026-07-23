import { useState } from "react";
import { navItems } from "../data/navigation";
import StickyNote from "./StickyNote";

export default function QuickNav() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="relative flex min-h-screen flex-col justify-center bg-navy px-6 py-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex items-start justify-between gap-6">
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-muted">
            Where to next
          </h2>
          <StickyNote rotate="2deg" className="hidden w-64 sm:block">
            <span className="font-note text-blue-light">A quick note —</span> the whole page is
            worth a look, but if you're short on time, jump straight to{" "}
            <span className="font-note text-blue-light">Best Work</span>.
          </StickyNote>
        </div>

        <nav aria-label="Section index">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {navItems.map((item) => {
              const isMuted = active !== null && active !== item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onMouseEnter={() => setActive(item.href)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(item.href)}
                    onBlur={() => setActive(null)}
                    className={`group flex flex-col gap-1 py-7 transition-opacity sm:flex-row sm:items-baseline sm:gap-6 ${
                      isMuted ? "opacity-40" : "opacity-100"
                    }`}
                  >
                    <span className="font-mono text-sm text-signal">{item.index}</span>
                    <span className="font-display text-3xl font-semibold text-paper sm:text-4xl lg:text-5xl">
                      {item.label}
                    </span>
                    <span className="text-sm text-muted sm:ml-auto sm:max-w-sm sm:text-right">
                      {item.description}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="mt-6 text-right font-mono text-xs text-muted/70">
          (Click a section name to jump there)
        </p>
      </div>
    </section>
  );
}
