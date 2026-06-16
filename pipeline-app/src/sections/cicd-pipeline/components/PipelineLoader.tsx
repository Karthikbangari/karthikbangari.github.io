import { useEffect, useState } from "react";
import styles from "../styles.module.css";

const MESSAGES = [
  "Preparing DevOps Environment…",
  "Loading Pipeline Architecture…",
  "Connecting Cloud Services…",
];

export function PipelineLoader() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(
      () => setI((n) => (n + 1) % MESSAGES.length),
      1100,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <div className={styles.loaderOrbit} aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <p className={styles.loaderText}>{MESSAGES[i]}</p>
    </div>
  );
}
