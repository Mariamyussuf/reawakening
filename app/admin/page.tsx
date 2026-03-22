"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const adminModules = [
    {
        id: "verses",
        title: "Daily Verses",
        description: "Add and manage daily Bible verses with reflections.",
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
        href: "/admin/verses",
        color: "gold"
    },
    {
        id: "conferences",
        title: "Conferences",
        description: "Create and edit conference details and registrations.",
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        href: "/admin/conferences",
        color: "navy"
    },
    {
        id: "books",
        title: "Books Library",
        description: "Upload, edit, and manage digital books for members.",
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
        href: "/admin/books",
        color: "gold"
    },
    {
        id: "devotionals",
        title: "Devotionals",
        description: "Create and manage daily spiritual reflections.",
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        href: "/admin/devotionals",
        color: "navy"
    },
    {
        id: "users",
        title: "User Management",
        description: "Manage users, roles, and community permissions.",
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
        href: "/admin/users",
        color: "gold"
    },
    {
        id: "archive",
        title: "Past Archive",
        description: "Add past conferences and messages to the archive.",
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
        href: "/admin/archive",
        color: "navy"
    },
];

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
    const visibleModules =
        userRole === "leader"
            ? adminModules.filter((module) => module.id !== "users")
            : adminModules;

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream-50">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-navy-900 border-t-transparent" />
                    <p className="mt-4 font-sans text-sm uppercase tracking-[0.2em] text-ink-400">
                        Checking Access
                    </p>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream-50 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-navy-950" />
                <div className="absolute top-1 left-0 w-full h-px bg-gold-500/30" />

                <div className="w-full max-w-md px-6 relative z-10">
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex flex-col items-center group">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-navy-900/10 rounded-2xl blur-xl" />
                                <img src="/images/logo.png" alt="Reawakening" className="relative w-16 h-16 object-contain" />
                            </div>
                            <h1 className="font-display text-3xl font-semibold text-navy-900 leading-none">Admin Portal</h1>
                            <div className="gold-line mx-auto my-4 w-12" />
                            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-gold-600">Secure Access Only</p>
                        </Link>
                    </div>

                    <div className="card-glass p-8 rounded-3xl shadow-premium text-center space-y-6">
                        <p className="font-sans text-sm text-ink-400 leading-relaxed">
                            Sign in with an account that has the <span className="font-bold text-navy-900">ADMIN</span> or <span className="font-bold text-navy-900">LEADER</span> role.
                        </p>

                        <Link
                            href="/auth/signin?callbackUrl=%2Fadmin"
                            className="btn-navy w-full py-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-3 group"
                        >
                            Sign In To Continue
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </Link>
                    </div>

                    <div className="mt-10 text-center">
                        <Link href="/" className="font-sans text-xs font-bold text-ink-400 hover:text-navy-900 transition-colors uppercase tracking-[0.1em] flex items-center justify-center gap-2">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                            Back to Ministry Site
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!canAccessAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream-50 overflow-hidden relative">
                <div className="w-full max-w-md px-6 relative z-10">
                    <div className="card-glass p-8 rounded-3xl shadow-premium text-center space-y-6">
                        <div>
                            <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-gold-600 mb-3">
                                Access Restricted
                            </p>
                            <h1 className="font-display text-3xl font-semibold text-navy-900">
                                Admin Role Required
                            </h1>
                        </div>

                        <p className="font-sans text-sm text-ink-400 leading-relaxed">
                            You are signed in as <span className="font-bold text-navy-900">{session?.user?.email}</span>, but this account does not have admin access.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Link href="/hub" className="btn-outline py-4 text-xs font-bold tracking-widest uppercase">
                                Go To Hub
                            </Link>
                            <AdminSignOutButton className="btn-navy py-4 text-xs font-bold tracking-widest uppercase" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-faint-gold/5 flex">
            <div className="hidden lg:block w-80 bg-navy-950 relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-hero-pattern opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/50 to-navy-950" />

                <div className="relative z-10 p-10 h-full flex flex-col">
                    <Link href="/" className="flex items-center gap-4 mb-16 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gold-400/20 rounded-xl blur-md group-hover:bg-gold-400/30 transition-all" />
                            <img src="/images/logo.png" alt="Reawakening" className="relative w-10 h-10 object-contain" />
                        </div>
                        <div>
                            <span className="font-display text-xl font-bold text-cream-50 block leading-none">Admin</span>
                            <span className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-gold-500/70">Terminal</span>
                        </div>
                    </Link>

                    <div className="flex-1 space-y-10">
                        <div>
                            <p className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-gold-500/50 mb-6">Status</p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="font-sans text-xs text-navy-300">Database Connected</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                                    <span className="font-sans text-xs text-navy-300">Role: {userRole?.toUpperCase()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-navy-800/80">
                            <p className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-gold-500/50 mb-6">Admin Note</p>
                            <p className="font-display italic text-base text-navy-300 leading-relaxed">
                                &ldquo;Whatever you do, work at it with all your heart, as working for the Lord.&rdquo;
                            </p>
                            <p className="text-[10px] font-sans text-gold-600 uppercase tracking-widest mt-4">Colossians 3:23</p>
                        </div>
                    </div>

                    <AdminSignOutButton className="mt-auto flex items-center gap-3 text-navy-400 hover:text-red-400 transition-colors py-4 border-t border-navy-800/80 font-sans text-xs font-bold uppercase tracking-widest" />
                </div>
            </div>

            <main className="flex-1 min-w-0 bg-cream-50 overflow-y-auto">
                <div className="lg:hidden flex items-center justify-between p-6 bg-navy-950 border-b border-gold-500/20">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="" className="w-7 h-7" />
                        <span className="font-display text-lg font-bold text-cream-50">Admin Panel</span>
                    </Link>
                    <AdminSignOutButton className="text-gold-500 font-sans text-xs font-bold uppercase tracking-[0.2em]" />
                </div>

                <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-cream-200">
                        <div>
                            <p className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-gold-600 mb-2">Management Console</p>
                            <h2 className="font-display text-5xl font-semibold text-navy-950">Administrative Control</h2>
                            <p className="mt-3 font-sans text-sm text-ink-400">
                                Signed in as <span className="font-semibold text-navy-900">{session?.user?.name || session?.user?.email}</span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/" className="btn-outline py-3 px-6 text-xs font-bold tracking-widest uppercase">Visit Site</Link>
                            <button className="btn-navy py-3 px-6 text-xs font-bold tracking-widest uppercase shadow-glow-navy">Deploy Update</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        {[
                            { label: "Total Members", val: "542", icon: "M12 4.354a4 4 0 110 5.292" },
                            { label: "Conf. Reg.", val: "128", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                            { label: "Active Prayers", val: "24", icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733" },
                            { label: "Books Shared", val: "12", icon: "M12 6.253v13m0-13C10.832 5.477" }
                        ].map((s, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-cream-200 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink-300 mb-1">{s.label}</p>
                                    <p className="font-display text-3xl font-bold text-navy-900">{s.val}</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-faint-gold/10 flex items-center justify-center text-gold-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {visibleModules.map((mod) => (
                            <Link
                                key={mod.id}
                                href={mod.href}
                                className="group relative bg-white p-8 rounded-3xl border border-cream-200 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br transition-opacity duration-300 opacity-0 group-hover:opacity-100 rounded-bl-[100px] border-l border-b border-cream-100 ${
                                    mod.color === "gold" ? "from-gold-50/40 to-white" : "from-navy-50/40 to-white"
                                }`} />

                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 shadow-sm ${
                                    mod.color === "gold"
                                        ? "bg-gradient-to-br from-gold-400 to-gold-600 text-white"
                                        : "bg-navy-900 text-gold-400"
                                }`}>
                                    {mod.icon}
                                </div>

                                <h3 className="font-display text-2xl font-semibold text-navy-950 mb-3 group-hover:text-gold-600 transition-colors uppercase tracking-tight">{mod.title}</h3>
                                <p className="font-sans text-sm text-ink-400 leading-relaxed mb-8">{mod.description}</p>

                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600 group-hover:gap-4 transition-all">
                                    Launch Module
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="card-navy p-10 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="max-w-md text-center md:text-left">
                                <h3 className="font-display text-2xl font-bold text-cream-50 mb-4 tracking-tight">Security & Oversight</h3>
                                <p className="font-sans text-xs text-navy-400 leading-relaxed uppercase tracking-widest">
                                    All administrative actions are logged and timestamped under this session. Ensure you sign out after completing your tasks.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center px-6 py-4 rounded-2xl bg-navy-900/50 border border-navy-800">
                                    <span className="font-display text-2xl font-bold text-gold-400">AES-256</span>
                                    <span className="font-sans text-[8px] font-bold tracking-[0.3em] uppercase text-navy-500 mt-1">Encryption</span>
                                </div>
                                <div className="flex flex-col items-center px-6 py-4 rounded-2xl bg-navy-900/50 border border-navy-800">
                                    <span className="font-display text-2xl font-bold text-gold-400">TLS 1.3</span>
                                    <span className="font-sans text-[8px] font-bold tracking-[0.3em] uppercase text-navy-500 mt-1">Handshake</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
