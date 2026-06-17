import { X, Info } from "lucide-react";
import { PipelineInfoPanel } from "./PipelineInfoPanel";
import styles from "../styles.module.css";

/**
 * Slide-in info drawer over the scene. Opens on station/timeline select; never
 * a permanent side panel. Controlled by the parent so a 3D click can open it.
 */
export function InfoDrawer({
  open,
  onClose,
  onOpen,
}: {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}) {
  return (
    <>
      {!open && (
        <button className={styles.drawerTab} onClick={onOpen} aria-label="Open station details">
          <Info size={15} aria-hidden /> Details
        </button>
      )}
      <aside
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        aria-hidden={!open}
      >
        <button className={styles.drawerClose} onClick={onClose} aria-label="Close details">
          <X size={16} aria-hidden />
        </button>
        <div className={styles.drawerBody}>
          <PipelineInfoPanel />
        </div>
      </aside>
    </>
  );
}
