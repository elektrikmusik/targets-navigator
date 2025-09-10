import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./button";
import { RefreshCw, AlertTriangle, Home, ChevronDown } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      showDetails: false,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      showDetails: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error);
    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      showDetails: false,
    });
  };

  private toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-8">
          <div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-8 text-center shadow-lg">
            <div className="mb-4 text-red-500">
              <AlertTriangle className="mx-auto h-16 w-16" />
            </div>

            <h2 className="mb-2 text-xl font-semibold text-gray-900">Something went wrong</h2>

            <p className="mb-6 text-gray-600">
              An unexpected error occurred while loading this component. This might be a temporary
              issue.
            </p>

            <div className="space-y-3">
              <div className="flex gap-3">
                <Button onClick={this.handleRetry} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>

                <Button
                  onClick={() => (window.location.href = "/")}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </div>

              {this.state.error && (
                <Button
                  onClick={this.toggleDetails}
                  variant="ghost"
                  size="sm"
                  className="w-full text-gray-500"
                >
                  <ChevronDown
                    className={`mr-2 h-4 w-4 transition-transform ${
                      this.state.showDetails ? "rotate-180" : ""
                    }`}
                  />
                  {this.state.showDetails ? "Hide" : "Show"} Error Details
                </Button>
              )}
            </div>

            {this.state.showDetails && this.state.error && (
              <div className="mt-4 rounded-lg bg-gray-50 p-4 text-left">
                <h4 className="mb-2 text-sm font-medium text-gray-700">Error Details:</h4>
                <pre className="text-xs break-words whitespace-pre-wrap text-gray-600">
                  {this.state.error.message}
                </pre>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-gray-500">
                      Component Stack
                    </summary>
                    <pre className="mt-1 text-xs whitespace-pre-wrap text-gray-500">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to handle errors
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error) => {
    console.error("Error caught:", error);
    // You can add error reporting service here
    // e.g., Sentry.captureException(error);
  }, []);

  return handleError;
};

// Higher-order component wrapper
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};
