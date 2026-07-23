import { useState } from "react";
import { navItems } from "../data/navigation";
import StickyNote from "./StickyNote";

export default function QuickNav() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="relative flex min-h-screen flex-col justify-center bg-gradient-to-br from-blue to-deep-blue px-6 py-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 flex items-start justify-between gap-6">
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-paper/80">
            Where to next
          </h2>
          <StickyNote rotate="2deg" className="hidden w-64 sm:block">
            <span className="font-note text-blue">A quick note —</span> the whole page is worth a
            look, but if you're short on time, jump straight to{" "}
            <span className="font-note text-blue">Best Work</span>.
          </StickyNote>
        </div>

        <nav aria-label="Section index">
          <ul>
            {navItems.map((item) => {
              const isActive = active === item.href;
              const isMuted = active !== null && !isActive;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onMouseEnter={() => setActive(item.href)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(item.href)}
                    onBlur={() => setActive(null)}
                    className={`group flex flex-col gap-1 py-6 transition-opacity sm:flex-row sm:items-baseline sm:gap-6 ${
                      isMuted ? "opacity-40" : "opacity-100"
                    }`}
                  >
                    <span className="font-mono text-sm text-signal">{item.index}</span>
                    <span className="relative font-display text-4xl font-bold text-paper sm:text-5xl lg:text-6xl">
                      {item.label}
                      <svg
                        viewBox="0 0 200 12"
                        aria-hidden="true"
                        className={`absolute -bottom-2 left-0 h-3 w-full transition-opacity ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <path
                          d="M2 8 C 50 2, 100 10, 198 5"
                          fill="none"
                          stroke="#C8FF22"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="text-sm text-paper/80 sm:ml-auto sm:max-w-sm sm:text-right">
                      {item.description}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="mt-6 text-right font-mono text-xs text-paper/60">
          (Click a section name to jump there)
        </p>
      </div>
    </section>
  );
}
