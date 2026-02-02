import { Component, type ErrorInfo, type ReactNode } from "react";
import { logger } from "../../services/logger";
import { ErrorFallback } from "./ErrorFallback";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error(error, {
            componentStack: errorInfo.componentStack,
            location: window.location.href
        });
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError && this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return <ErrorFallback error={this.state.error} resetErrorBoundary={this.handleReset} />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;