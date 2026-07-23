import { useState } from "react";
import { navItems } from "../data/navigation";

export default function QuickNav() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <nav aria-label="Section index" className="mx-auto max-w-6xl px-6 py-16">
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
                className={`group flex flex-col gap-1 py-6 transition-opacity sm:flex-row sm:items-baseline sm:gap-6 ${
                  isMuted ? "opacity-40" : "opacity-100"
                }`}
              >
                <span className="font-mono text-sm text-signal">{item.index}</span>
                <span className="font-display text-2xl font-semibold text-paper sm:text-3xl">
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
  );
}
