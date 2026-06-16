import { useAuthStore } from "@/store/auth.store";
import Button from "@/components/common/Button";

export default function DashboardPage() {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="w-full max-w-sm text-center space-y-4">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Dashboard
                </h1>

                {user && (
                    <p className="text-gray-600 dark:text-gray-300">
                        Logged in as <span className="font-medium">{user.firstName} {user.lastName}</span>
                    </p>
                )}

                <Button variant="secondary" onClick={logout}>
                    Logout
                </Button>
            </div>
        </div>
    );
}
