export default function Footer() {
    return (
        <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Blostem
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                    © {new Date().getFullYear()} All rights reserved.
                </span>
            </div>
        </footer>
    );
}
