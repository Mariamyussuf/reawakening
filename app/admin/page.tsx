"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type AdminModuleId =
    | "verses"
    | "conferences"
    | "books"
    | "devotionals"
    | "users"
    | "archive";

interface DashboardOverview {
    totalUsers: number;
    totalAdmins: number;
    totalLeaders: number;
    totalMembers: number;
    totalBooks: number;
    featuredBooks: number;
    totalDevotionals: number;
    publishedDevotionals: number;
    draftDevotionals: number;
    scheduledDevotionals: number;
    totalPrayers: number;
    answeredPrayers: number;
    activePrayers: number;
}

interface DashboardPayload {
    viewer: {
        name: string;
        email: string;
        role: "admin" | "leader" | "member";
    };
    overview: DashboardOverview;
    generatedAt: string;
}

const adminModules: Array<{
    id: AdminModuleId;
    title: string;
    description: string;
    href: string;
    accent: "gold" | "deep";
    icon: JSX.Element;
}> = [
    {
        id: "verses",
        title: "Daily Verses",
        description: "Manage scripture highlights and verse content for the platform.",
        href: "/admin/verses",
        accent: "gold",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
    },
    {
        id: "conferences",
        title: "Conferences",
        description: "Coordinate event details, attendance, and upcoming conference updates.",
        href: "/admin/conferences",
        accent: "deep",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        id: "books",
        title: "Books Library",
        description: "Upload, organize, and highlight books for members and study groups.",
        href: "/admin/books",
        accent: "gold",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
        ),
    },
    {
        id: "devotionals",
        title: "Devotionals",
        description: "Review drafts, publish devotionals, and keep the reading flow current.",
        href: "/admin/devotionals",
        accent: "deep",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        id: "users",
        title: "User Management",
        description: "Manage roles, access, and the people serving within the platform.",
        href: "/admin/users",
        accent: "gold",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        id: "archive",
        title: "Past Archive",
        description: "Curate past meetings, materials, and ministry records in one place.",
        href: "/admin/archive",
        accent: "deep",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
        ),
    },
];

function getModuleMeta(moduleId: AdminModuleId, overview: DashboardOverview) {
    switch (moduleId) {
        case "books":
            return `${overview.totalBooks} books, ${overview.featuredBooks} featured`;
        case "devotionals":
            return `${overview.publishedDevotionals} published, ${overview.draftDevotionals} drafts`;
        case "users":
            return `${overview.totalUsers} total users`;
        case "conferences":
            return `${overview.totalLeaders + overview.totalAdmins} leadership accounts active`;
        case "archive":
            return `${overview.totalDevotionals + overview.totalBooks} content items available`;
        case "verses":
        default:
            return `${overview.publishedDevotionals} published devotionals supporting scripture flow`;
    }
}

function AdminSignOutButton({ className = "" }: { className?: string }) {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/auth/signin?callbackUrl=%2Fadmin" })}
            className={className}
        >
            Sign Out
        </button>
    );
}

export default function AdminPage() {
    const { data: session, status } = useSession();
    const userRole = session?.user?.role;
    const canAccessAdmin = userRole === "admin" || userRole === "leader";
    const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
    const [loadingDashboard, setLoadingDashboard] = useState(false);
    const [dashboardError, setDashboardError] = useState("");

    useEffect(() => {
        if (!canAccessAdmin) {
            setDashboard(null);
            return;
        }

        let isMounted = true;

        const loadDashboard = async () => {
            setLoadingDashboard(true);
            setDashboardError("");

            try {
                const response = await fetch("/api/admin/dashboard", {
                    cache: "no-store",
                });

                const payload = await response.json();

                if (!response.ok) {
                    throw new Error(payload?.error || "Failed to load the admin dashboard.");
                }

                const data = payload?.data ?? payload;

                if (isMounted) {
                    setDashboard(data as DashboardPayload);
                }
            } catch (error: any) {
                if (isMounted) {
                    setDashboardError(error?.message || "Failed to load the admin dashboard.");
                }
            } finally {
                if (isMounted) {
                    setLoadingDashboard(false);
                }
            }
        };

        void loadDashboard();

        return () => {
            isMounted = false;
        };
    }, [canAccessAdmin]);

    const visibleModules =
        userRole === "leader"
            ? adminModules.filter((module) => module.id !== "users")
            : adminModules;

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-deep/70 font-display text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-lg rounded-3xl border border-mid/20 bg-warm-white p-8 sm:p-10 shadow-premium text-center">
                    <div className="inline-flex flex-col items-center mb-8">
                        <div className="relative mb-5 h-16 w-16">
                            <Image
                                src="/images/logo.png"
                                alt="Reawakening"
                                fill
                                className="object-contain"
                                sizes="64px"
                            />
                        </div>
                        <p className="eyebrow mb-3">Administrative Access</p>
                        <h1 className="font-display text-3xl text-deep">Sign in to continue</h1>
                    </div>

                    <p className="text-deep/70 leading-relaxed mb-8">
                        Use an account with the <span className="font-semibold text-deep">admin</span> or <span className="font-semibold text-deep">leader</span> role to open the ministry workspace.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link href="/auth/signin?callbackUrl=%2Fadmin" className="btn-primary">
                            Open Sign In
                        </Link>
                        <Link href="/" className="btn-outline">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!canAccessAdmin) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-lg rounded-3xl border border-mid/20 bg-warm-white p-8 sm:p-10 shadow-premium text-center">
                    <p className="eyebrow mb-3">Access Restricted</p>
                    <h1 className="font-display text-3xl text-deep mb-4">Admin role required</h1>
                    <p className="text-deep/70 leading-relaxed mb-8">
                        You are signed in as <span className="font-semibold text-deep">{session?.user?.email}</span>, but this account does not currently have access to the admin workspace.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link href="/hub" className="btn-primary">
                            Go to Member Hub
                        </Link>
                        <AdminSignOutButton className="btn-outline" />
                    </div>
                </div>
            </div>
        );
    }

    const overview = dashboard?.overview;
    const generatedAtLabel = dashboard?.generatedAt
        ? new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(dashboard.generatedAt))
        : "Refreshing data...";

    return (
        <div className="min-h-screen bg-cream font-body">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-2xl border border-gold/20 bg-warm-white overflow-hidden">
                            <Image
                                src="/images/logo.png"
                                alt="Reawakening"
                                fill
                                className="object-contain p-2"
                                sizes="48px"
                            />
                        </div>
                        <div>
                            <p className="eyebrow mb-1">Admin Workspace</p>
                            <h1 className="font-display text-3xl text-deep">Ministry operations</h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link href="/hub" className="btn-outline">
                            Member Hub
                        </Link>
                        <AdminSignOutButton className="btn-primary" />
                    </div>
                </div>

                <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div className="max-w-2xl">
                            <p className="text-xs text-deep/50 tracking-wide uppercase mb-2">Overview</p>
                            <h2 className="font-display text-2xl sm:text-4xl text-deep mb-3">
                                Welcome, {dashboard?.viewer?.name || session?.user?.name || "Administrator"}
                            </h2>
                            <p className="text-deep/70 leading-relaxed">
                                This dashboard now reflects live platform data instead of placeholder values, and access follows the authenticated user role for this session.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-deep p-5 min-w-[220px]">
                            <p className="text-[10px] tracking-[0.2em] uppercase text-gold/70 mb-2">Current Session</p>
                            <p className="font-display text-xl text-cream">{dashboard?.viewer?.email || session?.user?.email}</p>
                            <p className="text-sm text-cream/60 mt-1">
                                Role: {(dashboard?.viewer?.role || userRole || "member").toUpperCase()}
                            </p>
                            <p className="text-xs text-cream/50 mt-3">
                                Updated {generatedAtLabel}
                            </p>
                        </div>
                    </div>
                </div>

                {dashboardError && (
                    <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                        {dashboardError}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
                    {[
                        {
                            label: "Community",
                            value: overview ? `${overview.totalUsers}` : "—",
                            detail: overview
                                ? `${overview.totalMembers} members, ${overview.totalLeaders} leaders, ${overview.totalAdmins} admins`
                                : "Loading community summary...",
                        },
                        {
                            label: "Library",
                            value: overview ? `${overview.totalBooks}` : "—",
                            detail: overview
                                ? `${overview.featuredBooks} featured resources`
                                : "Loading book summary...",
                        },
                        {
                            label: "Devotionals",
                            value: overview ? `${overview.totalDevotionals}` : "—",
                            detail: overview
                                ? `${overview.publishedDevotionals} published, ${overview.draftDevotionals} drafts`
                                : "Loading devotional summary...",
                        },
                        {
                            label: "Prayer Requests",
                            value: overview ? `${overview.totalPrayers}` : "—",
                            detail: overview
                                ? `${overview.activePrayers} active, ${overview.answeredPrayers} answered`
                                : "Loading prayer summary...",
                        },
                    ].map((card) => (
                        <div key={card.label} className="bg-warm-white border border-mid/20 rounded-2xl p-5 shadow-sm">
                            <p className="text-xs text-deep/50 tracking-wide uppercase mb-2">{card.label}</p>
                            <p className="font-display text-3xl text-deep mb-2">
                                {loadingDashboard && !overview ? "…" : card.value}
                            </p>
                            <p className="text-sm text-deep/65 leading-relaxed">{card.detail}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-6 mb-10">
                    <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div>
                                <p className="eyebrow mb-2">Modules</p>
                                <h3 className="font-display text-2xl text-deep">Administrative tools</h3>
                            </div>
                            <span className="text-sm text-deep/50">
                                {visibleModules.length} modules available
                            </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {visibleModules.map((module) => (
                                <Link
                                    key={module.id}
                                    href={module.href}
                                    className="group rounded-2xl border border-mid/20 bg-cream p-5 hover:border-gold/40 hover:shadow-lift transition-all"
                                >
                                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${
                                        module.accent === "gold"
                                            ? "bg-gold/15 text-gold-dark"
                                            : "bg-deep text-cream"
                                    }`}>
                                        {module.icon}
                                    </div>

                                    <h4 className="font-display text-xl text-deep mb-2 group-hover:text-gold-dark transition-colors">
                                        {module.title}
                                    </h4>
                                    <p className="text-sm text-deep/70 leading-relaxed mb-4">
                                        {module.description}
                                    </p>
                                    <p className="text-xs uppercase tracking-[0.15em] text-deep/45 mb-4">
                                        {overview ? getModuleMeta(module.id, overview) : "Loading live summary..."}
                                    </p>
                                    <span className="inline-flex items-center gap-2 text-sm font-medium text-gold-dark group-hover:gap-3 transition-all">
                                        Open module
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-deep rounded-3xl p-6 border border-gold/20 shadow-sm">
                            <p className="eyebrow mb-3 text-gold/80">Serving Snapshot</p>
                            <h3 className="font-display text-2xl text-cream mb-3">Steward the platform well</h3>
                            <p className="text-sm text-cream/70 leading-relaxed mb-5">
                                Keep resources current, protect access carefully, and review open prayer and devotional workflows regularly.
                            </p>
                            <div className="space-y-3 text-sm text-cream/80">
                                <div className="flex items-center justify-between gap-3">
                                    <span>Open prayer requests</span>
                                    <span className="font-semibold text-gold">
                                        {overview ? overview.activePrayers : "—"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span>Draft devotionals</span>
                                    <span className="font-semibold text-gold">
                                        {overview ? overview.draftDevotionals : "—"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span>Featured books</span>
                                    <span className="font-semibold text-gold">
                                        {overview ? overview.featuredBooks : "—"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 shadow-sm">
                            <p className="eyebrow mb-3">Role Scope</p>
                            <h3 className="font-display text-2xl text-deep mb-3">
                                {(userRole || "member").toUpperCase()} access
                            </h3>
                            <p className="text-sm text-deep/70 leading-relaxed">
                                Leaders can access content and ministry tools. User management remains reserved for full admin accounts.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
