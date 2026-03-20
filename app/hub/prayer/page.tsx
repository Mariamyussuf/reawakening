"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Prayer {
    id: string;
    title: string;
    description: string;
    category?: string;
    isAnonymous?: boolean;
    isAnswered: boolean;
    answeredDate?: string;
    prayerCount: number;
    date: string;
    createdAt?: string;
}

interface CommunityPrayer extends Prayer {
    author: string;
    avatar: string;
    hasPrayed?: boolean;
}

export default function PrayerPage() {
    const [activeTab, setActiveTab] = useState("my-prayers");
    const [newRequest, setNewRequest] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [myPrayers, setMyPrayers] = useState<Prayer[]>([]);
    const [prayingFor, setPrayingFor] = useState<CommunityPrayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch prayers on mount and when tab changes
    useEffect(() => {
        setError("");
        setSuccess("");
        fetchPrayers();
    }, [activeTab]);

    const fetchPrayers = async () => {
        try {
            setLoading(true);
            setError("");

            if (activeTab === "my-prayers") {
                const response = await fetch("/api/prayers");
                if (!response.ok) throw new Error("Failed to fetch prayers");
                const data = await response.json();
                setMyPrayers(data.prayers || []);
            } else {
                const response = await fetch("/api/prayers/community");
                if (!response.ok) throw new Error("Failed to fetch community prayers");
                const data = await response.json();
                setPrayingFor(data.prayers || []);
            }
        } catch (err: any) {
            setError(err.message || "Failed to load prayers");
            console.error("Error fetching prayers:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newTitle.trim() || !newRequest.trim()) {
            setError("Please provide both title and description");
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            setSuccess("");

            const response = await fetch("/api/prayers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newTitle.trim(),
                    description: newRequest.trim(),
                    isAnonymous,
                    category: "general",
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to submit prayer");
            }

            setSuccess("Prayer request submitted successfully!");
            setNewTitle("");
            setNewRequest("");
            setIsAnonymous(false);
            await fetchPrayers();
        } catch (err: any) {
            setError(err.message || "Failed to submit prayer request");
        } finally {
            setSubmitting(false);
        }
    };

    const handleMarkAnswered = async (id: string) => {
        try {
            const response = await fetch(`/api/prayers/${id}/answer`, {
                method: "PATCH",
            });

            if (!response.ok) throw new Error("Failed to update prayer");

            await fetchPrayers();
            setSuccess("Prayer status updated!");
        } catch (err: any) {
            setError(err.message || "Failed to update prayer");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this prayer request?")) return;

        try {
            const response = await fetch(`/api/prayers/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete prayer");

            await fetchPrayers();
            setSuccess("Prayer deleted successfully!");
        } catch (err: any) {
            setError(err.message || "Failed to delete prayer");
        }
    };

    const handlePray = async (id: string) => {
        try {
            const response = await fetch(`/api/prayers/${id}/pray`, {
                method: "POST",
            });

            if (!response.ok) throw new Error("Failed to update prayer count");

            const data = await response.json();

            // Update local state
            if (activeTab === "praying-for") {
                setPrayingFor((prev) =>
                    prev.map((p) =>
                        p.id === id
                            ? { ...p, prayerCount: data.prayerCount, hasPrayed: data.hasPrayed }
                            : p
                    )
                );
            } else {
                await fetchPrayers();
            }
        } catch (err: any) {
            setError(err.message || "Failed to update prayer count");
        }
    };

    // Calculate stats
    const stats = {
        myRequests: myPrayers.length,
        prayingFor: prayingFor.filter((p) => p.hasPrayed).length,
        answered: myPrayers.filter((p) => p.isAnswered).length,
        streak: 7, // TODO: Calculate from user data
    };

    const prayerPrompts = [
        {
            category: "Morning Prayer",
            prompt: "Lord, thank You for this new day. Guide my steps and help me to glorify You in all I do.",
        },
        {
            category: "Study Prayer",
            prompt: "Father, grant me wisdom and understanding as I study. Help me to retain what I learn.",
        },
        {
            category: "Evening Prayer",
            prompt: "God, thank You for Your faithfulness today. Grant me peaceful rest and renew my strength.",
        },
        {
            category: "Gratitude Prayer",
            prompt: "Lord, I thank You for Your countless blessings. Help me to always have a grateful heart.",
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
                        <h1 className="text-2xl font-bold text-slate-800">Prayer Center</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            <main className="container-custom py-8">
                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {success}
                    </div>
                )}

                {/* Prayer Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-xs font-medium mb-2">My Requests</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.myRequests}</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-xs font-medium mb-2">Praying For</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.prayingFor}</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-xs font-medium mb-2">Answered</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.answered}</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-xs font-medium mb-2">Prayer Streak</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.streak}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* New Prayer Request */}
                        <div className="card">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Share a Prayer Request</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="Brief title for your prayer request..."
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
                                        maxLength={100}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        What can we pray for?
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={newRequest}
                                        onChange={(e) => setNewRequest(e.target.value)}
                                        placeholder="Share your prayer request with the community..."
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        maxLength={1000}
                                    />
                                    <p className="text-xs text-slate-500 mt-1">{newRequest.length}/1000 characters</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? "Submitting..." : "Submit Prayer Request"}
                                    </button>
                                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isAnonymous}
                                            onChange={(e) => setIsAnonymous(e.target.checked)}
                                            className="rounded"
                                        />
                                        <span>Keep anonymous</span>
                                    </label>
                                </div>
                            </form>
                        </div>

                        {/* Tabs */}
                        <div className="card">
                            <div className="border-b border-slate-200 mb-6">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setActiveTab("my-prayers")}
                                        className={`px-4 py-3 font-medium transition-all duration-200 border-b-2 ${activeTab === "my-prayers"
                                            ? "border-orange-600 text-orange-600"
                                            : "border-transparent text-slate-600 hover:text-slate-800"
                                            }`}
                                    >
                                        My Prayer Requests
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("praying-for")}
                                        className={`px-4 py-3 font-medium transition-all duration-200 border-b-2 ${activeTab === "praying-for"
                                            ? "border-orange-600 text-orange-600"
                                            : "border-transparent text-slate-600 hover:text-slate-800"
                                            }`}
                                    >
                                        I'm Praying For
                                    </button>
                                </div>
                            </div>

                            {/* My Prayers Tab */}
                            {activeTab === "my-prayers" && (
                                <div className="space-y-4">
                                    {loading ? (
                                        <div className="text-center py-8 text-slate-500">Loading prayers...</div>
                                    ) : myPrayers.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500">
                                            No prayer requests yet. Share your first prayer request above!
                                        </div>
                                    ) : (
                                        myPrayers.map((prayer) => (
                                            <div
                                                key={prayer.id}
                                                className={`p-4 rounded-lg border-2 transition-all duration-300 ${prayer.isAnswered
                                                    ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
                                                    : "bg-white border-slate-200 hover:shadow-md"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="font-bold text-slate-800">{prayer.title}</h3>
                                                            {prayer.isAnswered && (
                                                                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                                                    ✓ Answered
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-slate-600 text-sm mb-2">{prayer.description}</p>
                                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                                            <span>{prayer.date}</span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <span>🙏</span>
                                                                <span>{prayer.prayerCount} {prayer.prayerCount === 1 ? 'person' : 'people'} praying</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete(prayer.id)}
                                                        className="text-slate-400 hover:text-red-600 transition-colors"
                                                        title="Delete prayer"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                {!prayer.isAnswered && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleMarkAnswered(prayer.id)}
                                                            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                                                        >
                                                            Mark as Answered
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Praying For Tab */}
                            {activeTab === "praying-for" && (
                                <div className="space-y-4">
                                    {loading ? (
                                        <div className="text-center py-8 text-slate-500">Loading community prayers...</div>
                                    ) : prayingFor.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500">
                                            No community prayer requests yet. Check back later!
                                        </div>
                                    ) : (
                                        prayingFor.map((prayer) => (
                                            <div key={prayer.id} className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-all duration-300">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                                        {prayer.avatar}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-semibold text-slate-800">{prayer.author}</span>
                                                            <span className="text-xs text-slate-500">• {prayer.date}</span>
                                                        </div>
                                                        <h3 className="font-bold text-slate-800 mb-2">{prayer.title}</h3>
                                                        <p className="text-slate-600 text-sm mb-3">{prayer.description}</p>
                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                onClick={() => handlePray(prayer.id)}
                                                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${prayer.hasPrayed
                                                                    ? "text-orange-600 hover:text-orange-700"
                                                                    : "text-slate-600 hover:text-orange-600"
                                                                    }`}
                                                            >
                                                                <svg
                                                                    className={`w-4 h-4 ${prayer.hasPrayed ? "fill-current" : ""}`}
                                                                    fill={prayer.hasPrayed ? "currentColor" : "none"}
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                                </svg>
                                                                {prayer.hasPrayed ? "Praying" : "Pray"} ({prayer.prayerCount})
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Prayer Prompts */}
                        <div className="card">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Prayer Prompts</h3>
                            <div className="space-y-3">
                                {prayerPrompts.map((prompt, index) => (
                                    <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <p className="text-xs font-semibold text-orange-600 mb-2">{prompt.category}</p>
                                        <p className="text-sm text-slate-700 italic leading-relaxed">&quot;{prompt.prompt}&quot;</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Prayer Journal */}
                        <div className="card bg-gradient-to-br from-purple-50 to-pink-50">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Prayer Journal</h3>
                            <p className="text-sm text-slate-600 mb-4">
                                Keep track of your prayers and see how God answers them over time.
                            </p>
                            <Link href="/hub/prayer/journal" className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-center">
                                Open Journal
                            </Link>
                        </div>

                        {/* Scripture for Prayer */}
                        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50">
                            <h3 className="text-lg font-bold text-slate-800 mb-3">Today's Prayer Verse</h3>
                            <div className="p-3 bg-white rounded-lg border border-blue-200">
                                <p className="text-sm text-slate-700 italic mb-2">
                                    &quot;Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.&quot;
                                </p>
                                <p className="text-xs font-semibold text-blue-600">Philippians 4:6</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
