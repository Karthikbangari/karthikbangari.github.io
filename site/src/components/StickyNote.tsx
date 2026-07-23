import type { ReactNode } from "react";

export default function StickyNote({
  children,
  rotate = "-2deg",
  className = "",
}: {
  children: ReactNode;
  rotate?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative max-w-xs rounded-sm bg-paper px-5 py-4 text-navy shadow-[0_8px_20px_rgba(0,0,0,0.35)] ${className}`}
      style={{ transform: `rotate(${rotate})` }}
    >
      <span
        aria-hidden="true"
        className="absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rotate-1 bg-white/70"
      />
      <div className="font-note text-base leading-snug">{children}</div>
    </div>
  );
}
