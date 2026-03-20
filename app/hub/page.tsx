"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

const TEST_MODE = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_TEST_MODE === 'true';

const MOCK_USER_DATA = {
    name: "Test User",
    email: "test@reawakening.org",
    joinDate: "January 2026",
};

const quickLinks = [
    { title: "Bible Reader", href: "/hub/bible", icon: BookIcon },
    { title: "Books Library", href: "/hub/books", icon: BookmarkIcon },
    { title: "Daily Verse", href: "/daily-verse", icon: CrossIcon },
    { title: "Prayer Center", href: "/hub/prayer", icon: HeartIcon },
    { title: "Devotionals", href: "/hub/devotionals", icon: BookOpenIcon },
    { title: "Community", href: "/hub/community", icon: PeopleIcon },
];

const upcomingEvents = [
    { id: 1, title: "Post-Exam Conference 2026", date: "March 15, 2026", time: "10:00 AM", location: "Main Campus Hall", registered: true },
    { id: 2, title: "Prayer & Worship Night", date: "February 28, 2026", time: "6:00 PM", location: "Chapel", registered: false },
];

const recentActivity = [
    { id: 1, action: "Completed daily verse", time: "2 hours ago" },
    { id: 2, action: "Registered for conference", time: "1 day ago" },
    { id: 3, action: "Downloaded devotional guide", time: "3 days ago" },
];

// Icons
function BookIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    );
}

function BookmarkIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
    );
}

function CrossIcon() {
    return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <rect x="10" y="4" width="4" height="16" rx="0.5" />
            <rect x="4" y="10" width="16" height="4" rx="0.5" />
        </svg>
    );
}

function HeartIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    );
}

function BookOpenIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    );
}

function PeopleIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );
}

export default function MemberHub() {
    const { data: session } = useSession();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (TEST_MODE) {
            setUserData(MOCK_USER_DATA);
            setLoading(false);
        } else if (session) {
            fetchUserData();
        }
    }, [session]);

    const fetchUserData = async () => {
        try {
            const res = await fetch("/api/user");
            if (res.ok) {
                const data = await res.json();
                setUserData(data.user);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-deep/70 font-display text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream font-body">
            <Sidebar />

            {/* Main content - offset for sidebar on desktop */}
            <div className="md:ml-60">
                <div className="max-w-5xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-xs text-deep/50 tracking-wide uppercase mb-1">Welcome back</p>
                            <h1 className="font-display text-2xl font-medium text-deep">{userData.name}</h1>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-deep flex items-center justify-center text-cream font-display font-semibold">
                            {userData.name.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="mb-8">
                        <p className="eyebrow mb-4">Quick Access</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {quickLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.title}
                                        href={link.href}
                                        className="bg-warm-white border border-mid/20 rounded-lg p-4 text-center hover:border-gold/50 hover:shadow-lift transition-all group"
                                    >
                                        <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center mx-auto mb-2 text-gold group-hover:bg-gold/20 transition-colors">
                                            <Icon />
                                        </div>
                                        <span className="text-sm font-medium text-deep">{link.title}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Upcoming Events */}
                            <div className="bg-warm-white border border-mid/20 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="font-display text-xl text-deep">Upcoming Events</h2>
                                    <Link href="/conference" className="text-xs text-gold hover:text-gold-dark font-medium">
                                        View all →
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {upcomingEvents.map((ev) => (
                                        <div key={ev.id} className="flex items-center justify-between p-4 bg-cream rounded-lg border border-mid/10">
                                            <div>
                                                <h3 className="font-display text-deep">{ev.title}</h3>
                                                <p className="text-sm text-deep/50">{ev.date} · {ev.time} · {ev.location}</p>
                                            </div>
                                            {ev.registered ? (
                                                <span className="px-3 py-1 bg-mid/10 text-mid text-xs font-medium rounded-full">Registered</span>
                                            ) : (
                                                <button className="px-4 py-1.5 bg-gold text-deep text-xs font-semibold rounded hover:bg-gold-light transition-colors">
                                                    Register
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Side Column */}
                        <div className="space-y-6">
                            {/* Recent Activity */}
                            <div className="bg-warm-white border border-mid/20 rounded-lg p-6">
                                <h2 className="font-display text-xl text-deep mb-5">Recent Activity</h2>
                                <div className="space-y-4">
                                    {recentActivity.map((a) => (
                                        <div key={a.id} className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-gold mt-1.5" />
                                            <div>
                                                <p className="text-sm text-deep/80">{a.action}</p>
                                                <p className="text-xs text-deep/40">{a.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Join Community */}
                            <div className="bg-deep rounded-lg p-6 border border-gold/20">
                                <h3 className="font-display text-lg text-cream mb-2">Community</h3>
                                <p className="text-sm text-cream/60 mb-4">Connect with fellow members and grow together.</p>
                                <Link href="/hub/community" className="text-sm font-medium text-gold hover:text-gold-light">
                                    Join now →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
