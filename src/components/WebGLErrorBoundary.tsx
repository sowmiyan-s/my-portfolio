import React, { Component, ErrorInfo, ReactNode } from "react";

export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    if (gl) {
      const loseCtx = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context");
      if (loseCtx) loseCtx.loseContext();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: !isWebGLAvailable(),
  };

  public static getDerivedStateFromError(error: Error): State {
    console.warn("WebGL Error caught by WebGLErrorBoundary:", error?.message);
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL Context Creation Failed:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="fixed inset-0 bg-black pointer-events-none z-0 overflow-hidden">
            {/* Fallback CSS particle matrix */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0%,transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%),linear-gradient(90deg,rgba(255,0,0,0.05),transparent,rgba(255,0,0,0.05))] bg-[size:100%_4px,40px_100%]" />
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default WebGLErrorBoundary;
