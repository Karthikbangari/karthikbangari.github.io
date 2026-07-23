import { useEffect, useRef, useState } from "react";
import { Menu, X, Github, FileDown } from "lucide-react";
import { headerNavItems } from "../data/navigation";
import { links } from "../data/links";

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    menuRef.current?.querySelector("a")?.focus();

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-mono text-sm font-semibold tracking-wide text-paper">
          KARTHIK <span className="text-signal">/</span> DEVOPS
        </a>

        <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
          {headerNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-xs uppercase tracking-wider text-muted hover:text-paper transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href={links.resume}
            className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted hover:text-paper transition-colors"
          >
            <FileDown size={14} aria-hidden="true" />
            Resume
          </a>
          <a
            href={links.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="text-muted hover:text-paper transition-colors"
          >
            <Github size={18} />
          </a>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="md:hidden text-paper"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="md:hidden border-t border-white/10 bg-navy px-6 py-6"
        >
          <nav className="flex flex-col gap-5" aria-label="Mobile">
            {headerNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-mono text-sm uppercase tracking-wider text-paper"
              >
                {item.label}
              </a>
            ))}
            <a
              href={links.resume}
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-signal"
            >
              Resume
            </a>
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-paper"
            >
              GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
