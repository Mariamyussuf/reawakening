"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Use environment variable for development mode (only in development)
// Note: NEXT_PUBLIC_ vars are available on client side, so we can't use validated env here
const TEST_MODE = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_TEST_MODE === 'true';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Hooks must always be called unconditionally (Rules of Hooks)
    useEffect(() => {
        // In TEST_MODE, skip auth checks
        if (TEST_MODE) return;
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    // In TEST_MODE (development only), skip authentication checks
    if (TEST_MODE) {
        return <>{children}</>;
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-600 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4 animate-pulse">
                        <span className="text-white font-bold text-2xl">R</span>
                    </div>
                    <p className="text-slate-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return null;
    }

    return <>{children}</>;
}
