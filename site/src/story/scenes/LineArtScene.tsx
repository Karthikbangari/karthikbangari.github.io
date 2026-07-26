const PATH =
  "M20,200 C 120,220 160,80 220,90 C 300,105 340,220 420,210 C 500,200 560,70 620,100 C 690,135 730,205 800,190";

const LABELS = [
  { text: "build", x: 40, y: 200 },
  { text: "secure", x: 220, y: 90 },
  { text: "ship", x: 420, y: 210 },
  { text: "observe", x: 620, y: 100 },
  { text: "recover", x: 780, y: 190 },
];

export default function LineArtScene({
  registerPath,
  registerLabel,
}: {
  registerPath: (el: SVGPathElement | null) => void;
  registerLabel: (index: number, el: SVGTextElement | null) => void;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-black px-10 text-paper">
      <svg viewBox="0 0 860 260" className="w-full max-w-4xl" aria-hidden="true">
        <path
          ref={registerPath}
          d={PATH}
          fill="none"
          stroke="#FFFDF7"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {LABELS.map((l, i) => (
          <text
            key={l.text}
            ref={(el) => registerLabel(i, el)}
            x={l.x}
            y={l.y - 14}
            className="font-note"
            fill="#C8FF22"
            fontSize="20"
          >
            {l.text}
          </text>
        ))}
      </svg>
      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-paper/50">
        02 — Craft
      </p>
    </div>
  );
}