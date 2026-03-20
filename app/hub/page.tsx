"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    BellIcon,
    FlameIcon,
} from "@/components/icons";

const TEST_MODE = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_TEST_MODE === 'true';

const MOCK_USER_DATA = {
    name: "Test User",
    email: "test@reawakening.org",
    streak: 7,
    totalVerses: 42,
    upcomingEvents: 2,
    completedCourses: 3,
    joinDate: "January 2026",
};

const quickActions = [
    {
        title: "Bible Reader", description: "Read God's Word", href: "/hub/bible",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    },
    {
        title: "Books Library", description: "Christian books", href: "/hub/books",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
    },
    {
        title: "Today's Verse", description: "Daily inspiration", href: "/daily-verse",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
    },
    {
        title: "Prayer Center", description: "Pray together", href: "/hub/prayer",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
    },
    {
        title: "Devotionals", description: "Daily reflections", href: "/hub/devotionals",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    },
    {
        title: "Community", description: "Connect with members", href: "/hub/community",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
];

const upcomingEvents = [
    { id: 1, title: "Post-Exam Conference 2026", date: "March 15, 2026", time: "10:00 AM", location: "Main Campus Hall", registered: true },
    { id: 2, title: "Prayer & Worship Night", date: "February 28, 2026", time: "6:00 PM", location: "Chapel", registered: false },
];

const recentActivity = [
    { id: 1, action: "Completed daily verse", time: "2 hours ago" },
    { id: 2, action: "Registered for conference", time: "1 day ago" },
    { id: 3, action: "Downloaded devotional guide", time: "3 days ago" },
    { id: 4, action: "Joined prayer group", time: "5 days ago" },
];

const progressItems = [
    { label: "Bible Reading Plan", pct: 65, color: "#D4AF37" },
    { label: "Discipleship Course", pct: 40, color: "#1f3060" },
    { label: "Prayer Journey", pct: 85, color: "#b8911f" },
];

export default function MemberHub() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("overview");
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
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="relative inline-block mb-6">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse"
                            style={{ background: "linear-gradient(135deg, #D4AF37, #edca66)" }}>
                            <img src="/images/logo.png" alt="" className="w-10 h-10 object-contain" />
                        </div>
                    </div>
                    <p className="font-display text-xl text-navy-900">Loading your dashboard</p>
                    <p className="font-sans text-sm text-ink-400 mt-1">Preparing your spiritual journey…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-gold-600 mb-1">Dashboard</p>
                    <h1 className="font-display text-3xl font-semibold text-navy-900">
                        Welcome back, {userData.name.split(" ")[0]}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="relative w-10 h-10 rounded-xl flex items-center justify-center border border-ink-200 bg-white hover:border-gold-400 transition-colors shadow-card">
                        <BellIcon className="text-ink-500" size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-gold-500 rounded-full border-2 border-white" />
                    </button>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-navy-900 font-semibold font-sans text-sm"
                        style={{ background: "linear-gradient(135deg, #D4AF37, #edca66)" }}>
                        {userData.name.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl mb-10 p-10 shadow-premium"
                style={{ background: "linear-gradient(135deg, #0F1628 0%, #162147 100%)" }}>
                <div className="absolute inset-0 bg-hero-pattern opacity-100" />
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.15) 0%, transparent 65%)" }} />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-gold-400/80 mb-3">Spiritual Journal</p>
                        <p className="font-display text-3xl md:text-4xl font-light italic text-cream-50 leading-tight">
                            &ldquo;Thoroughly equipped to be on fire for God&rdquo;
                        </p>
                        <p className="font-sans text-sm text-navy-300 mt-4 flex items-center gap-2">
                            <span className="gold-dot" />
                            Member since {userData.joinDate} · {userData.email}
                        </p>
                    </div>
                    <div className="flex items-center gap-4 px-7 py-5 rounded-2xl backdrop-blur-md border border-gold-500/20 shadow-glow-gold"
                        style={{ background: "rgba(212,175,55,0.08)" }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gold-500/20 border border-gold-500/30">
                            <FlameIcon className="text-gold-400" size={26} />
                        </div>
                        <div>
                            <div className="font-display text-4xl font-semibold text-gold- gradient text-gold-gradient leading-none">{userData.streak}</div>
                            <div className="font-sans text-[10px] text-gold-400/70 tracking-[0.2em] uppercase mt-1">Day Streak</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { label: "Daily Streak", value: userData.streak, suffix: "days", icon: <FlameIcon className="text-gold-500" size={18} /> },
                    { label: "Verses Read", value: userData.totalVerses, suffix: "total", icon: <svg className="w-4.5 h-4.5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
                    { label: "Events", value: userData.upcomingEvents, suffix: "upcoming", icon: <svg className="w-4.5 h-4.5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
                    { label: "Courses", value: userData.completedCourses, suffix: "completed", icon: <svg className="w-4.5 h-4.5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-sans text-[10px] font-semibold tracking-widest uppercase text-ink-400">{stat.label}</span>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-cream-100/80 border border-cream-300/40">
                                {stat.icon}
                            </div>
                        </div>
                        <p className="font-display text-4xl font-semibold text-navy-900 leading-none mb-1.5">{stat.value}</p>
                        <p className="font-sans text-[11px] text-ink-400 font-medium">{stat.suffix}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-10">
                <div className="flex items-center gap-6 mb-6">
                    <h2 className="font-display text-2xl font-semibold text-navy-900">Quick Actions</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-gold-300/40 to-transparent" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {quickActions.map((action, i) => (
                        <Link
                            key={i}
                            href={action.href}
                            className="group relative bg-white rounded-2xl p-6 border border-ink-100/60 transition-all duration-300 hover:border-gold-300 hover:-translate-y-1 shadow-card hover:shadow-card-hover text-center"
                        >
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4 text-navy-900 transition-all duration-500 group-hover:scale-110 shadow-sm"
                                style={{ background: "linear-gradient(135deg, #D4AF37, #edca66)" }}>
                                {action.icon}
                            </div>
                            <h3 className="font-sans text-xs font-bold text-navy-900 mb-1">{action.title}</h3>
                            <p className="font-sans text-[10px] text-ink-400 font-medium leading-tight">{action.description}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Events */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card shadow-card hover:shadow-card-hover rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-display text-2xl font-semibold text-navy-900">Upcoming Events</h2>
                            <Link href="/conference" className="font-sans text-xs font-bold text-gold-600 hover:text-gold-700 inline-flex items-center gap-1.5 transition-all group">
                                View Full Calendar
                                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {upcomingEvents.map((ev) => (
                                <div key={ev.id}
                                    className="flex items-start justify-between gap-6 p-5 rounded-2xl border border-ink-100/60 bg-cream-50/30 hover:bg-white hover:border-gold-300/50 transition-all duration-300 group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-ink-100/60 flex flex-col items-center justify-center text-navy-900 shadow-sm">
                                            <span className="text-[10px] font-bold uppercase text-gold-600 leading-none">Mar</span>
                                            <span className="text-lg font-display font-bold leading-none mt-1">15</span>
                                        </div>
                                        <div>
                                            <h3 className="font-sans text-base font-bold text-navy-900 mb-1 group-hover:text-gold-600 transition-colors">{ev.title}</h3>
                                            <div className="flex items-center gap-3 font-sans text-xs text-ink-500">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    {ev.time}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-ink-200" />
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    {ev.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {ev.registered ? (
                                        <span className="badge badge-gold px-4 py-2">Registered ✓</span>
                                    ) : (
                                        <button className="btn-primary text-xs px-5 py-2.5 rounded-xl shadow-sm">
                                            Register
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Activity */}
                    <div className="card shadow-card rounded-2xl p-8">
                        <h2 className="font-display text-2xl font-semibold text-navy-900 mb-6">Recent Activity</h2>
                        <div className="space-y-6">
                            {recentActivity.map((a) => (
                                <div key={a.id} className="flex items-start gap-4">
                                    <div className="gold-dot mt-1.5 ring-4 ring-gold-500/10" />
                                    <div>
                                        <p className="font-sans text-sm font-bold text-navy-800 leading-tight">{a.action}</p>
                                        <p className="font-sans text-[11px] text-ink-400 mt-1 font-medium italic">{a.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats Card Dark */}
                    <div className="card-navy rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:scale-150 duration-700" />
                        <p className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-gold-400/60 mb-2">Fellowship</p>
                        <h3 className="font-display text-2xl font-semibold text-cream-50 mb-6 leading-tight">Growing together in fire & zeal.</h3>
                        <Link href="/hub/community" className="inline-flex items-center gap-2 font-sans text-xs font-bold text-gold-400 hover:text-gold-300 transition-all group/link">
                            Go to community
                            <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Progress / Tabs */}
            <div className="mt-10">
                <div className="card-glass rounded-3xl p-8">
                    {/* Tabs */}
                    <div className="flex gap-2 border-b border-cream-300/60 mb-8 overflow-x-auto">
                        {["Overview", "My Progress", "Resources", "Community"].map((tab) => {
                            const key = tab.toLowerCase().replace(" ", "-");
                            const active = activeTab === key;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(key)}
                                    className={`px-6 py-3 text-sm font-bold whitespace-nowrap font-sans transition-all duration-300 border-b-[3px] -mb-px ${
                                        active
                                            ? "border-gold-500 text-navy-900"
                                            : "border-transparent text-ink-400 hover:text-navy-700"
                                    }`}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>

                    <div className="min-h-[240px]">
                        {activeTab === "overview" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-6">
                                <div>
                                    <h3 className="font-display text-3xl font-semibold text-navy-900 mb-4 tracking-tight">Your Spiritual Journey Dashboard</h3>
                                    <p className="font-sans text-sm text-ink-500 leading-relaxed mb-6">
                                        This is your personalized space to track your devotionals, scripture engagement, and community involvement. Explore the tabs to see your detailed progress.
                                    </p>
                                    <div className="flex gap-3">
                                        <div className="badge badge-gold px-4 py-2">Daily Verse Ready ✓</div>
                                        <div className="badge badge-navy px-4 py-2">2 New Prayers</div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gold-500/5 rounded-3xl blur-2xl" />
                                    <div className="relative p-8 rounded-3xl border border-gold-300/30 bg-white/40 backdrop-blur-sm shadow-sm text-center">
                                        <div className="display-md text-gold-gradient mb-2 uppercase tracking-tighter">Day {userData.streak}</div>
                                        <p className="font-sans text-xs font-bold text-ink-400 tracking-widest uppercase">Consecutive Streak</p>
                                        <div className="gold-line mx-auto my-6" />
                                        <p className="font-display italic text-lg text-navy-700 leading-relaxed">
                                            &ldquo;Therefore, be imitators of God, as beloved children.&rdquo;
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "my-progress" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center py-6">
                                {progressItems.map((p) => (
                                    <div key={p.label} className="card-cream p-6 border-gold-300/40">
                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink-400 mb-1">Learning Track</p>
                                                <p className="font-display text-xl font-bold text-navy-900">{p.label}</p>
                                            </div>
                                            <span className="font-display text-2xl font-bold" style={{ color: p.color }}>{p.pct}%</span>
                                        </div>
                                        <div className="w-full h-2.5 rounded-full bg-cream-300/50 overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${p.pct}%`, background: p.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === "resources" && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow-gold"
                                    style={{ background: "linear-gradient(135deg, #0F1628, #162147)" }}>
                                    <svg className="w-8 h-8 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <h3 className="font-display text-2xl font-bold text-navy-900 mb-3">Spiritual Treasury</h3>
                                <p className="font-sans text-sm text-ink-500 mb-8 max-w-sm mx-auto">Access your personal library of saved books, course materials, and study resources.</p>
                                <Link href="/resources" className="btn-navy py-4 px-10 text-sm">Explore Resource Hub</Link>
                            </div>
                        )}
                        {activeTab === "community" && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow-gold"
                                    style={{ background: "linear-gradient(135deg, #0F1628, #162147)" }}>
                                    <svg className="w-8 h-8 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                                <h3 className="font-display text-2xl font-bold text-navy-900 mb-3">Member Fellowship</h3>
                                <p className="font-sans text-sm text-ink-500 mb-8 max-w-sm mx-auto">Connect with fellow believe, share testimonies, and join collective prayer groups.</p>
                                <Link href="/hub/community" className="btn-navy py-4 px-10 text-sm">Join the Conversation</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
