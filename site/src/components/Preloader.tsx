import { useEffect, useRef, useState } from "react";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "../lib/motion";

const SESSION_KEY = "preloader-seen";

// Decided once, from a lazy initializer — reading sessionStorage here (not
// writing) keeps this safe under React StrictMode's dev-only double-invoke,
// which would otherwise make the second pass see the first pass's write and
// skip the animation instantly.
function shouldAnimate() {
  if (prefersReducedMotion()) return false;
  return !sessionStorage.getItem(SESSION_KEY);
}

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [animate] = useState(shouldAnimate);
  const wordLeftRef = useRef<HTMLSpanElement>(null);
  const wordRightRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  useEffect(() => {
    if (!animate) {
      finish();
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "1");
    ensureGsapRegistered();

    const counter = { value: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          gsap.to(rootRef.current, {
            autoAlpha: 0,
            duration: 0.4,
            onComplete: finish,
          });
        },
      });

      gsap.set(wordLeftRef.current, { x: -60, y: -14, rotate: -7, filter: "blur(6px)" });
      gsap.set(wordRightRef.current, { x: 70, y: 16, rotate: 5, filter: "blur(6px)" });

      tl.to(
        counter,
        {
          value: 100,
          duration: 2,
          ease: "power1.inOut",
          onUpdate: () => {
            if (percentRef.current) {
              percentRef.current.textContent = `${Math.round(counter.value)}%`;
            }
            if (barRef.current) {
              barRef.current.style.width = `${counter.value}%`;
            }
          },
        },
        0,
      )
        .to(wordLeftRef.current, { x: 0, y: 0, rotate: 0, filter: "blur(0px)", duration: 1.6 }, 0.1)
        .to(wordRightRef.current, { x: 0, y: 0, rotate: 0, filter: "blur(0px)", duration: 1.6 }, 0.1)
        .to({}, { duration: 0.3 }); // brief hold at 100%
    }, rootRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate]);

  if (!animate) return null;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label="Loading introduction"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-blue px-6 text-paper"
    >
      <div className="flex w-full max-w-3xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span
          ref={wordLeftRef}
          className="font-display text-4xl font-bold leading-tight sm:text-6xl"
        >
          I build
          <br />
          reliable systems
        </span>
        <span
          ref={wordRightRef}
          className="font-hand text-4xl text-signal sm:text-6xl"
        >
          Automation
          <br />
          by intention
        </span>
      </div>

      <div className="mt-10 flex w-full max-w-xs flex-col items-center gap-2">
        <span ref={percentRef} className="font-mono text-2xl text-signal">
          0%
        </span>
        <div className="h-1 w-full overflow-hidden rounded-full bg-paper/20">
          <div ref={barRef} className="h-full w-0 bg-signal" />
        </div>
      </div>

      <button
        type="button"
        onClick={finish}
        className="absolute bottom-8 right-8 font-mono text-xs text-paper/70 hover:text-signal"
      >
        Skip Animation →
      </button>
    </div>
  );
}
