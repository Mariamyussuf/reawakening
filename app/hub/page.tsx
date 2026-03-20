"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
    BibleIcon,
    LibraryIcon,
    SparklesIcon,
    GraduationCapIcon,
    HeartIcon,
    UsersIcon,
    CalendarIcon,
    ClockIcon,
    FlameIcon,
    TrendingUpIcon,
    BellIcon,
    CheckCircleIcon,
    MapPinIcon
} from "@/components/icons";

// Use environment variable for development mode (only in development)
// Note: NEXT_PUBLIC_ vars are available on client side, so we can't use validated env here
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
            const response = await fetch("/api/user");
            if (response.ok) {
                const data = await response.json();
                setUserData(data.user);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !userData) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                    <div className="text-center">
                        <img
                            src="/images/logo.png"
                            alt="Reawakening Logo"
                            className="w-16 h-16 mx-auto mb-4 object-contain animate-pulse"
                        />
                        <p className="text-neutral-900 font-semibold text-base">Loading your dashboard...</p>
                        <p className="text-neutral-500 text-sm mt-1">Preparing your spiritual journey</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    const upcomingEvents = [
        {
            id: 1,
            title: "Post-Exam Conference 2026",
            date: "March 15, 2026",
            time: "10:00 AM",
            location: "Main Campus Hall",
            registered: true,
        },
        {
            id: 2,
            title: "Prayer & Worship Night",
            date: "February 28, 2026",
            time: "6:00 PM",
            location: "Chapel",
            registered: false,
        },
    ];

    const recentActivity = [
        { id: 1, action: "Completed daily verse", time: "2 hours ago" },
        { id: 2, action: "Registered for conference", time: "1 day ago" },
        { id: 3, action: "Downloaded devotional guide", time: "3 days ago" },
        { id: 4, action: "Joined prayer group", time: "5 days ago" },
    ];

    const quickActions = [
        {
            title: "Bible Reader",
            description: "Read God's Word",
            href: "/hub/bible",
            iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
            color: "emerald",
        },
        {
            title: "Books Library",
            description: "Christian books",
            href: "/hub/books",
            iconPath: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
            color: "slate",
        },
        {
            title: "Today's Verse",
            description: "Daily inspiration",
            href: "/daily-verse",
            iconPath: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z",
            color: "amber",
        },
        {
            title: "My Courses",
            description: "Continue learning",
            href: "/resources/courses",
            iconPath: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5",
            color: "blue",
        },
        {
            title: "Prayer Center",
            description: "Share & pray together",
            href: "/hub/prayer",
            iconPath: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
            color: "rose",
        },
        {
            title: "Devotionals",
            description: "Daily inspiration",
            href: "/hub/devotionals",
            iconPath: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z",
            color: "amber",
        },
        {
            title: "Community",
            description: "Connect with members",
            href: "/hub/community",
            iconPath: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
            color: "indigo",
        },
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-neutral-50">
                <main className="container-custom py-8">
                    {/* Top Bar for Desktop - Notification & Profile - Now aligned right */}
                    <div className="flex justify-end items-center mb-8 gap-4 px-4 sm:px-0">
                        <button className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors group">
                            <BellIcon className="text-neutral-600 group-hover:text-neutral-900 transition-colors" size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="flex items-center gap-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-neutral-900">{userData.name}</p>
                                <p className="text-xs text-neutral-500">{userData.email}</p>
                            </div>
                            <div className="w-9 h-9 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg flex items-center justify-center text-white font-semibold shadow-sm">
                                {userData.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                    {/* Welcome Banner */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl shadow-md mb-8 p-8">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-semibold text-white mb-1">
                                        Welcome back, {userData.name.split(" ")[0]}
                                    </h1>
                                    <p className="text-orange-50 text-base md:text-lg">Continue your spiritual journey today</p>
                                </div>
                                <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                                    <FlameIcon className="text-white" size={24} />
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-white">{userData.streak}</div>
                                        <div className="text-xs text-orange-50">Day Streak</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="stat-card">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-neutral-600 text-xs font-medium uppercase tracking-wide">Current Streak</span>
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <FlameIcon className="text-orange-600" size={18} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-neutral-900 mb-0.5">{userData.streak}</p>
                            <p className="text-xs text-neutral-500">days active</p>
                        </div>

                        <div className="stat-card group">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-slate-600 text-sm font-semibold">Verses Read</span>
                                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-slate-900 mb-1">{userData.totalVerses}</p>
                            <p className="text-xs text-slate-500 font-medium">total verses</p>
                        </div>

                        <div className="stat-card group">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-slate-600 text-sm font-semibold">Events</span>
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-slate-900 mb-1">{userData.upcomingEvents}</p>
                            <p className="text-xs text-slate-500 font-medium">upcoming</p>
                        </div>

                        <div className="stat-card group">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-slate-600 text-sm font-semibold">Courses</span>
                                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-slate-900 mb-1">{userData.completedCourses}</p>
                            <p className="text-xs text-slate-500 font-medium">completed</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-slate-900">Quick Actions</h2>
                            <div className="h-1 flex-1 ml-6 bg-gradient-to-r from-orange-200 to-transparent rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {quickActions.map((action, index) => {
                                const colorClasses: Record<string, { bg: string; hover: string; text: string }> = {
                                    emerald: { bg: 'bg-orange-50', hover: 'group-hover:bg-orange-100', text: 'text-orange-600' },
                                    slate: { bg: 'bg-slate-50', hover: 'group-hover:bg-slate-100', text: 'text-slate-600' },
                                    amber: { bg: 'bg-amber-50', hover: 'group-hover:bg-amber-100', text: 'text-amber-600' },
                                    blue: { bg: 'bg-blue-50', hover: 'group-hover:bg-blue-100', text: 'text-blue-600' },
                                    rose: { bg: 'bg-rose-50', hover: 'group-hover:bg-rose-100', text: 'text-rose-600' },
                                    indigo: { bg: 'bg-indigo-50', hover: 'group-hover:bg-indigo-100', text: 'text-indigo-600' },
                                };
                                const colors = colorClasses[action.color] || colorClasses.slate;

                                return (
                                    <Link
                                        key={index}
                                        href={action.href}
                                        className="group relative bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center mb-4 ${colors.hover} transition-colors`}>
                                            <svg className={`w-6 h-6 ${colors.text}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d={action.iconPath} />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-slate-900 mb-1 text-sm">{action.title}</h3>
                                        <p className="text-xs text-slate-500">{action.description}</p>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Upcoming Events */}
                        <div className="lg:col-span-2">
                            <div className="card-glass">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900">Upcoming Events</h2>
                                    <Link href="/conference" className="text-orange-600 hover:text-orange-700 font-semibold text-sm inline-flex items-center gap-1 group">
                                        View All
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {upcomingEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="relative overflow-hidden p-5 bg-gradient-to-br from-slate-50 to-orange-50/50 rounded-xl border border-orange-100/50 hover:shadow-lg transition-all duration-300 group"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-slate-900 mb-2 text-lg group-hover:text-orange-600 transition-colors">{event.title}</h3>
                                                    <div className="space-y-1.5 text-sm text-slate-600">
                                                        <p className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {event.date} at {event.time}
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {event.location}
                                                        </p>
                                                    </div>
                                                </div>
                                                {event.registered ? (
                                                    <span className="badge badge-success">
                                                        Registered ✓
                                                    </span>
                                                ) : (
                                                    <button className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all hover:scale-105">
                                                        Register
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Recent Activity */}
                            <div className="card-glass">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h2>
                                <div className="space-y-4">
                                    {recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-900">{activity.action}</p>
                                                <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Member Since */}
                            <div className="card-premium bg-gradient-to-br from-orange-50 to-amber-50">
                                <div className="text-center relative z-10">
                                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg mb-4">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-1 font-medium">Member Since</p>
                                    <p className="text-2xl font-bold text-slate-900 mb-4">{userData.joinDate}</p>
                                    <div className="pt-4 border-t border-orange-200">
                                        <Link href="/hub/settings" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm group">
                                            Manage Account
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="mt-8">
                        <div className="card-glass">
                            <div className="border-b border-slate-200 mb-6">
                                <div className="flex gap-4 overflow-x-auto">
                                    {["Overview", "My Progress", "Resources", "Community"].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab.toLowerCase().replace(" ", "-"))}
                                            className={`px-5 py-3 font-semibold transition-all duration-200 border-b-2 whitespace-nowrap ${activeTab === tab.toLowerCase().replace(" ", "-")
                                                ? "border-orange-600 text-orange-600"
                                                : "border-transparent text-slate-600 hover:text-slate-900"
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[200px]">
                                {activeTab === "overview" && (
                                    <div className="text-center py-12">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl mb-4">
                                            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <p className="text-slate-600 text-lg">Your personalized dashboard overview is displayed above.</p>
                                    </div>
                                )}
                                {activeTab === "my-progress" && (
                                    <div className="space-y-6">
                                        <h3 className="font-bold text-slate-900 mb-4 text-xl">Learning Progress</h3>
                                        <div className="space-y-5">
                                            <div>
                                                <div className="flex justify-between mb-3">
                                                    <span className="text-sm font-semibold text-slate-700">Bible Reading Plan</span>
                                                    <span className="text-sm font-bold text-orange-600">65%</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-500" style={{ width: "65%" }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-3">
                                                    <span className="text-sm font-semibold text-slate-700">Discipleship Course</span>
                                                    <span className="text-sm font-bold text-blue-600">40%</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500" style={{ width: "40%" }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-3">
                                                    <span className="text-sm font-semibold text-slate-700">Prayer Journey</span>
                                                    <span className="text-sm font-bold text-purple-600">85%</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500" style={{ width: "85%" }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "resources" && (
                                    <div className="text-center py-12">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl mb-4">
                                            <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <p className="text-slate-600 mb-6 text-lg">Access your saved resources and downloads</p>
                                        <Link href="/resources" className="btn-primary inline-block">
                                            Browse Resources
                                        </Link>
                                    </div>
                                )}
                                {activeTab === "community" && (
                                    <div className="text-center py-12">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl mb-4">
                                            <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-slate-600 mb-6 text-lg">Connect with other members and join discussions</p>
                                        <Link href="/hub/community" className="btn-primary inline-block">
                                            Join Community
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
