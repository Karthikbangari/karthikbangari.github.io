import { useEffect, useState } from "react";

const LINES = [
  { prompt: "$ whoami", output: "karthik-bangari" },
  { prompt: "$ role", output: "devops-engineer" },
  { prompt: "$ focus", output: "aws + kubernetes + terraform + gitops" },
  { prompt: "$ mission", output: "ship-faster && operate-reliably" },
];

const SESSION_KEY = "intro-seen";

export default function TerminalIntro({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(false);
  const [linesShown, setLinesShown] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = sessionStorage.getItem(SESSION_KEY);

    if (alreadySeen || reducedMotion) {
      onDone();
      return;
    }

    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, "1");

    const revealStep = 1800 / LINES.length;
    const timers = LINES.map((_, i) =>
      setTimeout(() => setLinesShown((n) => Math.max(n, i + 1)), i * revealStep),
    );
    const finish = setTimeout(finishIntro, 1800 + 250);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishIntro = () => {
    setVisible(false);
    onDone();
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Loading introduction"
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy px-6"
    >
      <div className="w-full max-w-lg font-mono text-sm sm:text-base">
        {LINES.slice(0, linesShown).map((line) => (
          <div key={line.prompt} className="mb-2">
            <div className="text-signal">{line.prompt}</div>
            <div className="text-paper/90">{line.output}</div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={finishIntro}
        className="absolute bottom-8 right-8 font-mono text-xs text-muted hover:text-paper transition-colors"
      >
        Skip →
      </button>
    </div>
  );
}
