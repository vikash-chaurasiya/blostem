import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import ErrorFallback from "@/components/common/ErrorFallback";

function getErrorMessage(error: unknown): string | undefined {
    if (error == null) return undefined;
    if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    return String(error);
}

/**
 * Router `errorElement` — React Router catches render/loader errors thrown
 * inside route components here, so they get the themed fallback instead of
 * the default "Unexpected Application Error!" screen.
 */
export default function RouteErrorBoundary() {
    const error = useRouteError();
    if (import.meta.env.DEV) console.error("Route error:", error);
    return (
        <ErrorFallback
            detail={getErrorMessage(error)}
            onReset={() => window.location.assign("/")}
        />
    );
}
