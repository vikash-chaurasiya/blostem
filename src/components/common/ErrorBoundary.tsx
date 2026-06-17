import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import ErrorFallback from "./ErrorFallback";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * Top-level error boundary — catches render-time crashes that happen OUTSIDE
 * the data router (providers, session restore). Route-component crashes are
 * caught by the router's `errorElement` (see RouteErrorBoundary).
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // In a real app this would go to an error-reporting service.
        console.error("Uncaught render error:", error, info.componentStack);
    }

    render() {
        if (!this.state.hasError) return this.props.children;
        return (
            <ErrorFallback
                detail={this.state.error?.message}
                onReset={() => window.location.assign("/")}
            />
        );
    }
}
