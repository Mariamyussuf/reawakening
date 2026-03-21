"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readStoredIds, writeStoredIds } from "@/lib/community-storage";

const STORAGE_KEY = "community-group-requests";

const groups = [
    {
        id: "morning-word-circle",
        name: "Morning Word Circle",
        schedule: "Mondays and Thursdays, 6:30 AM",
        leader: "Sarah Johnson",
        focus: "Bible reading, prayer, and accountability before the day begins.",
        seatsLeft: 7,
    },
    {
        id: "campus-fire-fellowship",
        name: "Campus Fire Fellowship",
        schedule: "Wednesdays, 7:00 PM",
        leader: "Michael Chen",
        focus: "Student-led worship, Scripture discussion, and practical discipleship.",
        seatsLeft: 4,
    },
    {
        id: "young-leaders-table",
        name: "Young Leaders Table",
        schedule: "Saturdays, 10:00 AM",
        leader: "Rachel Martinez",
        focus: "Leadership growth, ministry conversations, and mentoring.",
        seatsLeft: 3,
    },
];

export default function CommunityGroupsPage() {
    const [requestedGroups, setRequestedGroups] = useState<string[]>([]);
    const [status, setStatus] = useState("");

    useEffect(() => {
        setRequestedGroups(readStoredIds(STORAGE_KEY));
    }, []);

    const toggleRequest = (groupId: string) => {
        const nextState = requestedGroups.includes(groupId)
            ? requestedGroups.filter((id) => id !== groupId)
            : [...requestedGroups, groupId];

        setRequestedGroups(nextState);
        writeStoredIds(STORAGE_KEY, nextState);
        setStatus(
            requestedGroups.includes(groupId)
                ? "Group request removed."
                : "Group request saved. You can track it from this page anytime.",
        );
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
                    <h1 className="text-2xl font-bold text-slate-800">Study Groups</h1>
                    <div className="w-28" />
                </div>
            </header>

            <main className="container-custom py-8 space-y-6">
                {status && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {status}
                    </div>
                )}

                <div className="card bg-white/80">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Find a circle that keeps you consistent</h2>
                    <p className="text-slate-600">
                        Request a place in a smaller group for prayer, Bible study, and honest accountability.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {groups.map((group) => {
                        const requested = requestedGroups.includes(group.id);

                        return (
                            <div key={group.id} className="card">
                                <p className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-3">
                                    Open Group
                                </p>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{group.name}</h3>
                                <p className="text-sm text-slate-500 mb-2">{group.schedule}</p>
                                <p className="text-sm text-slate-600 mb-2">Leader: {group.leader}</p>
                                <p className="text-sm text-slate-600 mb-4">{group.focus}</p>
                                <p className="text-xs font-medium text-slate-500 mb-6">{group.seatsLeft} seats still open</p>
                                <button
                                    onClick={() => toggleRequest(group.id)}
                                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                                        requested
                                            ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            : "bg-orange-600 text-white hover:bg-orange-700"
                                    }`}
                                >
                                    {requested ? "Requested" : "Request to Join"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
