"use client";

import Link from "next/link";

const groups = [
    {
        name: "Morning Word Circle",
        schedule: "Mondays & Thursdays, 6:30 AM",
        focus: "Bible reading, prayer, and accountability before the day begins.",
    },
    {
        name: "Campus Fire Fellowship",
        schedule: "Wednesdays, 7:00 PM",
        focus: "Student-led worship, Scripture discussion, and practical discipleship.",
    },
    {
        name: "Young Leaders Table",
        schedule: "Saturdays, 10:00 AM",
        focus: "Leadership growth, ministry conversations, and mentoring.",
    },
];

export default function CommunityGroupsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                <div className="container-custom py-4 flex items-center justify-between gap-4">
                    <Link href="/hub/community" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-medium">Back to Community</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">Study Groups</h1>
                    <div className="w-28" />
                </div>
            </header>

            <main className="container-custom py-8 space-y-6">
                <div className="card bg-white/80">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Grow with people who will sharpen your faith</h2>
                    <p className="text-slate-600">
                        Join a circle for prayer, Bible study, and consistent spiritual encouragement.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <div key={group.name} className="card">
                            <p className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-3">Open Group</p>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{group.name}</h3>
                            <p className="text-sm text-slate-500 mb-4">{group.schedule}</p>
                            <p className="text-slate-600 mb-6">{group.focus}</p>
                            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
                                Request to Join
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
