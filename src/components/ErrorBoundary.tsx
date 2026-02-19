import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled UI error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="login-page">
          <section className="card login-panel">
            <p className="eyebrow">InsightX</p>
            <h1>Something broke</h1>
            <p className="muted">Reload the page to recover. This boundary prevents a full white screen.</p>
            <button className="button" onClick={() => window.location.reload()}>
              Reload App
            </button>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}
