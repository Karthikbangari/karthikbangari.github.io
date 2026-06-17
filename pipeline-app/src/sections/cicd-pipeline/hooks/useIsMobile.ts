import { useEffect, useState } from "react";

/** True on small/phone-width screens — drives the guided mobile journey. */
export function useIsMobile(maxWidth = 700): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, [maxWidth]);
  return isMobile;
}
