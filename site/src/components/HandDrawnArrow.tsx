export default function HandDrawnArrow({
  className = "",
  color = "currentColor",
  flip = false,
}: {
  className?: string;
  color?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 80"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <path
        d="M6 10 C 40 6, 55 28, 46 44 C 39 57, 60 66, 90 58"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M76 50 L91 59 L82 71"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
