"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function Sidebar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: "Feed", href: "/hub", icon: "🏠" },
        { name: "Devotionals", href: "/hub/devotionals", icon: "📖" },
        { name: "Bible Reader", href: "/hub/bible", icon: "✝️" },
        { name: "Prayer Center", href: "/hub/prayer", icon: "🙏" },
        { name: "Books Library", href: "/hub/books", icon: "📚" },
        { name: "Community", href: "/hub/community", icon: "👥" },
        { name: "Settings", href: "/hub/settings", icon: "⚙️" },
    ];

    return (
        <>
            {/* Mobile Menu Button - Floating */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-colors"
                aria-label="Toggle menu"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    {mobileMenuOpen ? (
                        <path d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-40 transition-transform duration-300 ease-in-out transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-6 border-b border-slate-100">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <img
                                src="/images/logo.png"
                                alt="Reawakening Logo"
                                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="text-lg font-bold text-slate-800">Reawakening</span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? "bg-orange-50 text-orange-600 font-semibold shadow-sm"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile / Logout Section */}
                    <div className="p-4 border-t border-slate-100">
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex items-center space-x-3 w-full px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors duration-200"
                        >
                            <span className="text-xl">🚪</span>
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
