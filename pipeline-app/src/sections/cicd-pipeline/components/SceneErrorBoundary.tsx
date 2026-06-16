import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
  /** Notified when the 3D scene fails, so the parent can drop to 2D. */
  onError?: () => void;
}

interface State {
  hasError: boolean;
}

/**
 * Isolates the 3D scene. WebGL/three runtime failures are caught here so they
 * can NEVER unmount the rest of the section — the 2D experience always survives.
 */
export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface the real cause for debugging without crashing the page.
    console.error("[cicd-pipeline] 3D scene failed, falling back to 2D:", error, info);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
