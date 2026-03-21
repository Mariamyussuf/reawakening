"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface CommunityPrayer {
    id: string;
    author: string;
    avatar: string;
    title: string;
    description: string;
    prayerCount: number;
    date: string;
    hasPrayed?: boolean;
}

const communityMembers = [
    { id: 1, name: "Sarah Johnson", role: "Prayer Leader", avatar: "S", streak: 15, online: true },
    { id: 2, name: "Michael Chen", role: "Study Group Lead", avatar: "M", streak: 22, online: true },
    { id: 3, name: "Emily Davis", role: "Worship Team", avatar: "E", streak: 8, online: false },
    { id: 4, name: "David Wilson", role: "Member", avatar: "D", streak: 12, online: true },
    { id: 5, name: "Rachel Martinez", role: "Outreach Coordinator", avatar: "R", streak: 30, online: false },
    { id: 6, name: "James Anderson", role: "Member", avatar: "J", streak: 5, online: true },
];

const communityActions = [
    {
        title: "Study Groups",
        href: "/hub/community/groups",
        summary: "Find a consistent circle for Bible study, accountability, and shared prayer.",
        label: "Open Groups",
    },
    {
        title: "Community Events",
        href: "/hub/community/events",
        summary: "Save your spot for prayer gatherings, study sessions, and outreach moments.",
        label: "View Events",
    },
    {
        title: "Testimonies",
        href: "/hub/community/testimonies",
        summary: "Read what God is doing in the community and share your own story.",
        label: "Read Stories",
    },
];

export default function CommunityPage() {
    const [communityPrayers, setCommunityPrayers] = useState<CommunityPrayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        void fetchCommunityPrayers();
    }, []);

    const fetchCommunityPrayers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/prayers/community");
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(payload?.error || "Failed to load community prayers");
            }

            const prayers = payload?.data?.prayers || payload?.prayers || [];
            setCommunityPrayers(Array.isArray(prayers) ? prayers : []);
        } catch (err: any) {
            setError(err.message || "Failed to load community prayers");
            setCommunityPrayers([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePray = async (id: string) => {
        try {
            const response = await fetch(`/api/prayers/${id}/pray`, { method: "POST" });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(payload?.error || "Failed to update prayer");
            }

            const data = payload?.data || payload;
            setCommunityPrayers((prev) =>
                prev.map((prayer) =>
                    prayer.id === id
                        ? {
                              ...prayer,
                              prayerCount: data?.prayerCount ?? prayer.prayerCount,
                              hasPrayed: data?.hasPrayed ?? prayer.hasPrayed,
                          }
                        : prayer,
                ),
            );
        } catch (err: any) {
            setError(err.message || "Failed to update prayer");
        }
    };

    const stats = {
        activeMembers: communityMembers.filter((member) => member.online).length,
        prayerRequests: communityPrayers.length,
        nextSteps: communityActions.length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/hub" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back to Hub</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-800">Community</h1>
                        <div className="w-20" />
                    </div>
                </div>
            </header>

            <main className="container-custom py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                        <p className="text-orange-100 text-sm mb-1">Active Members</p>
                        <p className="text-3xl font-bold">{stats.activeMembers}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                        <p className="text-orange-100 text-sm mb-1">Community Prayers</p>
                        <p className="text-3xl font-bold">{stats.prayerRequests}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                        <p className="text-orange-100 text-sm mb-1">Community Paths</p>
                        <p className="text-3xl font-bold">{stats.nextSteps}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <section className="card">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Prayer Requests</h2>
                                    <p className="text-sm text-slate-500 mt-1">Support the community with prayer and encouragement.</p>
                                </div>
                                <Link
                                    href="/hub/prayer"
                                    className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                                >
                                    Add Request
                                </Link>
                            </div>

                            {loading ? (
                                <div className="text-center py-10 text-slate-500">Loading community prayers...</div>
                            ) : communityPrayers.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
                                    No public prayer requests yet. The prayer center is ready when the first one is shared.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {communityPrayers.slice(0, 6).map((prayer) => (
                                        <div key={prayer.id} className="p-4 bg-gradient-to-r from-slate-50 to-orange-50 rounded-lg border border-slate-200">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                                    {prayer.avatar}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        <span className="font-semibold text-slate-800">{prayer.author}</span>
                                                        <span className="text-xs text-slate-500">{prayer.date}</span>
                                                    </div>
                                                    <h3 className="font-bold text-slate-800 mb-1">{prayer.title}</h3>
                                                    <p className="text-slate-700 mb-3">{prayer.description}</p>
                                                    <div className="flex items-center gap-4 flex-wrap">
                                                        <button
                                                            onClick={() => handlePray(prayer.id)}
                                                            className={`text-sm font-medium ${
                                                                prayer.hasPrayed
                                                                    ? "text-orange-700 hover:text-orange-800"
                                                                    : "text-orange-600 hover:text-orange-700"
                                                            }`}
                                                        >
                                                            {prayer.hasPrayed ? "Praying" : "Pray for This"} ({prayer.prayerCount})
                                                        </button>
                                                        <Link href="/hub/prayer" className="text-sm text-slate-600 hover:text-slate-800">
                                                            Open Prayer Center
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="card">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Community Workflow</h2>
                                    <p className="text-sm text-slate-500 mt-1">Move from connection to participation in one place.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {communityActions.map((action) => (
                                    <Link
                                        key={action.href}
                                        href={action.href}
                                        className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md hover:border-orange-300 transition-all"
                                    >
                                        <p className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-3">
                                            Community Step
                                        </p>
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">{action.title}</h3>
                                        <p className="text-sm text-slate-600 mb-4">{action.summary}</p>
                                        <span className="text-sm font-semibold text-orange-600">{action.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <section className="card">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Active Members</h3>
                            <div className="space-y-3">
                                {communityMembers.filter((member) => member.online).map((member) => (
                                    <div key={member.id} className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {member.avatar}
                                            </div>
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{member.name}</p>
                                            <p className="text-xs text-slate-500">{member.role}</p>
                                        </div>
                                        <div className="text-xs text-orange-600 font-medium">{member.streak} day streak</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="card bg-gradient-to-br from-orange-50 to-amber-50">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Next Best Step</h3>
                            <p className="text-sm text-slate-600 mb-4">
                                If you are just getting started, begin in the prayer center and then join a smaller circle for consistent community.
                            </p>
                            <div className="space-y-2">
                                <Link href="/hub/prayer" className="block w-full px-4 py-3 bg-white rounded-lg hover:shadow-sm transition-all text-slate-700 font-medium">
                                    Open Prayer Center
                                </Link>
                                <Link href="/hub/community/groups" className="block w-full px-4 py-3 bg-white rounded-lg hover:shadow-sm transition-all text-slate-700 font-medium">
                                    Browse Study Groups
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
