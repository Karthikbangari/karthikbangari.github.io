import { links } from "../data/links";
import { SCENES, type SceneId } from "./sceneConfig";

export default function StoryNav({
  activeId,
  onJump,
}: {
  activeId: SceneId;
  onJump: (id: SceneId) => void;
}) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 z-40 flex items-center justify-between bg-cream px-6 py-3 text-navy">
        <span className="font-mono text-sm font-semibold tracking-wide">
          Karthik Bangari
        </span>
        <a
          href={links.resume}
          className="hidden font-mono text-xs uppercase tracking-wider text-muted-ink hover:text-blue sm:block"
        >
          Fastest way to know me → Best Work → Contact
        </a>
      </div>

      <nav
        aria-label="Story chapters"
        className="absolute inset-x-0 bottom-0 z-40 flex justify-center gap-1 border-t-2 border-navy bg-cream px-4 py-3 sm:gap-4"
      >
        {SCENES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onJump(s.id)}
            aria-current={s.id === activeId ? "true" : undefined}
            className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors sm:text-xs ${
              s.id === activeId ? "bg-navy text-signal" : "text-navy/60 hover:text-navy"
            }`}
          >
            {s.navLabel}
          </button>
        ))}
      </nav>
    </>
  );
}
