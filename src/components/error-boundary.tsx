import React from "react";

interface Props {
  children?: React.ReactNode;
}
interface State {
  error?: Error;
  errorInfo?: React.ErrorInfo;
}
export class MyErrorBoundary extends React.Component<Props, State> {
  public state: State = {};

  public static getDerivedStateFromError(error: Error): State {
    return { error };
  }
  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.error)
      return <code style={{ padding: "1em", whiteSpace: "pre-wrap" }}>{JSON.stringify(this.state, null, 2)}</code>;
    return this.props.children;
  }
}
