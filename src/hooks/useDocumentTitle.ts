import { useEffect } from "react";

const BASE_TITLE = "Blostem";

/**
 * Sets the document title as `Blostem | {title}`.
 * Pass an empty/undefined title to show just `Blostem`.
 * Restores the previous title on unmount.
 */
export function useDocumentTitle(title?: string | null) {
    useEffect(() => {
        const previous = document.title;
        document.title = title ? `${BASE_TITLE} | ${title}` : BASE_TITLE;
        return () => {
            document.title = previous;
        };
    }, [title]);
}
