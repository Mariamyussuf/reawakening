"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readStoredIds, writeStoredIds } from "@/lib/community-storage";

const STORAGE_KEY = "community-event-rsvps";

const events = [
    {
        id: "night-of-prayer",
        title: "Night of Prayer",
        date: "Friday, 7:00 PM",
        location: "Upper Room Hall",
        description: "An extended time of intercession, worship, and Scripture meditation.",
    },
    {
        id: "bible-study-intensive",
        title: "Bible Study Intensive",
        date: "Saturday, 11:00 AM",
        location: "Learning Center",
        description: "A focused workshop on studying the Bible with clarity and confidence.",
    },
    {
        id: "community-outreach-day",
        title: "Community Outreach Day",
        date: "Next Tuesday, 9:00 AM",
        location: "City Center",
        description: "Serving our local community through prayer, encouragement, and practical care.",
    },
];

export default function CommunityEventsPage() {
    const [savedEvents, setSavedEvents] = useState<string[]>([]);
    const [status, setStatus] = useState("");

    useEffect(() => {
        setSavedEvents(readStoredIds(STORAGE_KEY));
    }, []);

    const toggleRsvp = (eventId: string) => {
        const nextState = savedEvents.includes(eventId)
            ? savedEvents.filter((id) => id !== eventId)
            : [...savedEvents, eventId];

        setSavedEvents(nextState);
        writeStoredIds(STORAGE_KEY, nextState);
        setStatus(savedEvents.includes(eventId) ? "RSVP removed." : "Spot saved for this event.");
    };

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
                {status && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {status}
                    </div>
                )}

                {events.map((event) => {
                    const saved = savedEvents.includes(event.id);

                    return (
                        <div key={event.id} className="card flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-2">Upcoming Event</p>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">{event.title}</h2>
                                <p className="text-slate-500 mb-1">{event.date}</p>
                                <p className="text-sm text-slate-500 mb-3">{event.location}</p>
                                <p className="text-slate-600">{event.description}</p>
                            </div>
                            <button
                                onClick={() => toggleRsvp(event.id)}
                                className={`px-5 py-3 rounded-lg font-medium transition-colors ${
                                    saved ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-orange-600 text-white hover:bg-orange-700"
                                }`}
                            >
                                {saved ? "Spot Saved" : "Save Spot"}
                            </button>
                        </div>
                    );
                })}
            </main>
        </div>
    );
}
