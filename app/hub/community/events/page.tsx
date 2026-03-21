"use client";

import Link from "next/link";

const events = [
    {
        title: "Night of Prayer",
        date: "Friday, 7:00 PM",
        description: "An extended time of intercession, worship, and Scripture meditation.",
    },
    {
        title: "Bible Study Intensive",
        date: "Saturday, 11:00 AM",
        description: "A focused workshop on studying the Bible with clarity and confidence.",
    },
    {
        title: "Community Outreach Day",
        date: "Next Tuesday, 9:00 AM",
        description: "Serving our local community through prayer, encouragement, and practical care.",
    },
];

export default function CommunityEventsPage() {
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
                    <h1 className="text-2xl font-bold text-slate-800">Community Events</h1>
                    <div className="w-28" />
                </div>
            </header>

            <main className="container-custom py-8 space-y-6">
                {events.map((event) => (
                    <div key={event.title} className="card flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-2">Upcoming Event</p>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">{event.title}</h2>
                            <p className="text-slate-500 mb-3">{event.date}</p>
                            <p className="text-slate-600">{event.description}</p>
                        </div>
                        <button className="px-5 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
                            Save Spot
                        </button>
                    </div>
                ))}
            </main>
        </div>
    );
}
