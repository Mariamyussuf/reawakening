import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function HubLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-cream-50 flex">
                <Sidebar />
                <main className="flex-1 min-w-0 overflow-x-hidden pb-20 md:pb-0 md:ml-64">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
