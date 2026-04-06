"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Yakalanan hata:", error);
    console.error("[ErrorBoundary] Bilesen yigini:", errorInfo.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
            padding: "40px 20px",
            textAlign: "center",
            fontFamily:
              "'Playfair Display', 'Georgia', serif, system-ui, sans-serif",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "#C4705610",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C47056"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "#1a1a1a",
              marginBottom: "8px",
            }}
          >
            Bir seyler ters gitti
          </h2>

          <p
            style={{
              fontSize: "0.95rem",
              color: "#666",
              marginBottom: "24px",
              maxWidth: "400px",
            }}
          >
            Beklenmeyen bir hata olustu. Lutfen tekrar deneyin.
          </p>

          <button
            onClick={this.handleRetry}
            style={{
              backgroundColor: "#C47056",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 32px",
              fontSize: "0.95rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#b3624a")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#C47056")
            }
          >
            Tekrar Dene
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
