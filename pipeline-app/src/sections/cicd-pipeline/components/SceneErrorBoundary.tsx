import { Component, type ErrorInfo, type ReactNode } from "react";
import styles from "../styles.module.css";

interface Props {
  children: ReactNode;
  onError?: () => void;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Isolates the 3D scene. WebGL/three runtime failures are caught here so they
 * can NEVER unmount the rest of the section. Instead of silently hiding the
 * scene, it shows the actual error message so it can be diagnosed.
 */
export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message ?? String(error) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[cicd-pipeline] 3D scene failed:", error, info);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.stageFallback}>
          <strong>3D scene couldn’t start on this device.</strong>
          <span className={styles.stageErr}>{this.state.message}</span>
          <span>Switch to 2D for the full pipeline.</span>
        </div>
      );
    }
    return this.props.children;
  }
}
