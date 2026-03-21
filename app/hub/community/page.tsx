"use client";

import Link from "next/link";
import { useState } from "react";

export default function CommunityPage() {
    const [activeFilter, setActiveFilter] = useState("all");

    const communityMembers = [
        { id: 1, name: "Sarah Johnson", role: "Prayer Leader", avatar: "S", streak: 15, online: true },
        { id: 2, name: "Michael Chen", role: "Study Group Lead", avatar: "M", streak: 22, online: true },
        { id: 3, name: "Emily Davis", role: "Worship Team", avatar: "E", streak: 8, online: false },
        { id: 4, name: "David Wilson", role: "Member", avatar: "D", streak: 12, online: true },
        { id: 5, name: "Rachel Martinez", role: "Outreach Coordinator", avatar: "R", streak: 30, online: false },
        { id: 6, name: "James Anderson", role: "Member", avatar: "J", streak: 5, online: true },
    ];

    const prayerRequests = [
        {
            id: 1,
            author: "Sarah Johnson",
            avatar: "S",
            request: "Please pray for my upcoming exams and for wisdom in my studies.",
            time: "2 hours ago",
            prayers: 12,
        },
        {
            id: 2,
            author: "Michael Chen",
            avatar: "M",
            request: "Praying for healing for my family member who is in the hospital.",
            time: "5 hours ago",
            prayers: 24,
        },
        {
            id: 3,
            author: "Emily Davis",
            avatar: "E",
            request: "Seeking guidance for a major life decision. Please pray for clarity.",
            time: "1 day ago",
            prayers: 18,
        },
    ];

    const discussions = [
        {
            id: 1,
            title: "How do you maintain spiritual discipline during busy exam periods?",
            author: "David Wilson",
            replies: 15,
            lastActive: "30 min ago",
            category: "Discussion",
        },
        {
            id: 2,
            title: "Favorite worship songs for personal devotion",
            author: "Rachel Martinez",
            replies: 28,
            lastActive: "2 hours ago",
            category: "Worship",
        },
        {
            id: 3,
            title: "Bible study tips for beginners",
            author: "James Anderson",
            replies: 42,
            lastActive: "5 hours ago",
            category: "Study",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            {/* Header */}
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
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            <main className="container-custom py-8">
                {/* Community Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm mb-1">Active Members</p>
                                <p className="text-3xl font-bold">248</p>
                            </div>
                            <div className="text-5xl opacity-20">Members</div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm mb-1">Prayer Requests</p>
                                <p className="text-3xl font-bold">42</p>
                            </div>
                            <div className="text-5xl opacity-20">Prayer</div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm mb-1">Active Discussions</p>
                                <p className="text-3xl font-bold">18</p>
                            </div>
                            <div className="text-5xl opacity-20">Talk</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Prayer Requests */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">Prayer Requests</h2>
                                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                                    + Add Request
                                </button>
                            </div>

                            <div className="space-y-4">
                                {prayerRequests.map((request) => (
                                    <div key={request.id} className="p-4 bg-gradient-to-r from-slate-50 to-orange-50 rounded-lg border border-slate-200 hover:shadow-md transition-all duration-300">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                                {request.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-semibold text-slate-800">{request.author}</span>
                                                    <span className="text-xs text-slate-500">• {request.time}</span>
                                                </div>
                                                <p className="text-slate-700 mb-3">{request.request}</p>
                                                <div className="flex items-center gap-4">
                                                    <button className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        I&apos;m Praying ({request.prayers})
                                                    </button>
                                                    <button className="text-sm text-slate-600 hover:text-slate-800">
                                                        Comment
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Discussions */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">Discussions</h2>
                                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                                    + New Topic
                                </button>
                            </div>

                            <div className="space-y-3">
                                {discussions.map((discussion) => (
                                    <div key={discussion.id} className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                                                        {discussion.category}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold text-slate-800 mb-1 hover:text-orange-600">
                                                    {discussion.title}
                                                </h3>
                                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                                    <span>by {discussion.author}</span>
                                                    <span>•</span>
                                                    <span>{discussion.replies} replies</span>
                                                    <span>•</span>
                                                    <span>{discussion.lastActive}</span>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Online Members */}
                        <div className="card">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Active Members</h3>
                            <div className="space-y-3">
                                {communityMembers.filter(m => m.online).map((member) => (
                                    <div key={member.id} className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {member.avatar}
                                            </div>
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{member.name}</p>
                                            <p className="text-xs text-slate-500">{member.role}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-orange-600">
                                            <span>Streak</span>
                                            <span>{member.streak}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="card bg-gradient-to-br from-orange-50 to-amber-50">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Links</h3>
                            <div className="space-y-2">
                                <Link href="/hub/community/groups" className="block p-3 bg-white rounded-lg hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">Members</span>
                                        <span className="font-medium text-slate-700">Study Groups</span>
                                    </div>
                                </Link>
                                <Link href="/hub/community/events" className="block p-3 bg-white rounded-lg hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">Events</span>
                                        <span className="font-medium text-slate-700">Community Events</span>
                                    </div>
                                </Link>
                                <Link href="/hub/community/testimonies" className="block p-3 bg-white rounded-lg hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">Stories</span>
                                        <span className="font-medium text-slate-700">Testimonies</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
