import { Check, X, FileDiff } from "lucide-react";
import { usePipeline } from "../PipelineProvider";
import { PIPELINE_STAGES } from "../pipelineConfig";
import styles from "../styles.module.css";

export function ApprovalGate() {
  const { state, dispatch } = usePipeline();
  if (state.phase !== "awaitingApproval" || state.approvalFor === null)
    return null;

  const stage = PIPELINE_STAGES[state.approvalFor];

  return (
    <div className={styles.approvalGate} role="alertdialog" aria-label="Approval required">
      <div className={styles.approvalText}>
        <strong>Approval gate</strong>
        <span>
          Manual sign-off required before “{stage.title}” deploys to production.
        </span>
      </div>
      <div className={styles.approvalActions}>
        <button
          className={styles.btnGhost}
          onClick={() => dispatch({ type: "SELECT_STAGE", index: state.approvalFor! })}
        >
          <FileDiff size={15} aria-hidden /> View Changes
        </button>
        <button className={styles.btnDanger} onClick={() => dispatch({ type: "REJECT" })}>
          <X size={15} aria-hidden /> Reject
        </button>
        <button className={styles.btnPrimary} onClick={() => dispatch({ type: "APPROVE" })}>
          <Check size={15} aria-hidden /> Approve
        </button>
      </div>
    </div>
  );
}
