import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Options {
  targetRef: React.RefObject<HTMLElement | null>;
  count: number;
  /** Only guide when idle on capable desktops — Run takes over otherwise. */
  enabled: boolean;
  onIndex: (index: number) => void;
}

/**
 * Optional GSAP ScrollTrigger guided camera: as the section scrolls through the
 * viewport, focus advances station-to-station (by changing the selected stage,
 * which the camera rig already follows). Manual Run still works — this only
 * runs while idle. Cleaned up fully on unmount / when disabled.
 */
export function useScrollGuide({ targetRef, count, enabled, onIndex }: Options) {
  const lastIndex = useRef(-1);

  useEffect(() => {
    const el = targetRef.current;
    if (!el || !enabled) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 72%",
      end: "bottom 55%",
      scrub: 0.6,
      onUpdate: (self) => {
        const index = Math.round(self.progress * (count - 1));
        if (index !== lastIndex.current) {
          lastIndex.current = index;
          onIndex(index);
        }
      },
    });

    return () => trigger.kill();
  }, [targetRef, count, enabled, onIndex]);
}
