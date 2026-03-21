"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface JournalEntry {
    id: string;
    title?: string;
    content: string;
    category: string;
    mood?: string;
    tags: string[];
    date: string;
    time: string;
    createdAt?: string;
    updatedAt?: string;
}

interface JournalStats {
    totalEntries: number;
    thisMonth: number;
    answered: number;
    streak: number;
}

export default function PrayerJournalPage() {
    const [newEntry, setNewEntry] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("general");
    const [selectedMood, setSelectedMood] = useState("");
    const [tags, setTags] = useState("");
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
    const [stats, setStats] = useState<JournalStats>({
        totalEntries: 0,
        thisMonth: 0,
        answered: 0,
        streak: 0,
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filterCategory, setFilterCategory] = useState("all");

    const categories = [
        { id: "general", name: "General Prayer", color: "slate" },
        { id: "morning", name: "Morning Prayer", color: "amber" },
        { id: "evening", name: "Evening Prayer", color: "indigo" },
        { id: "gratitude", name: "Gratitude", color: "orange" },
        { id: "answered", name: "Answered Prayer", color: "blue" },
        { id: "study", name: "Study Prayer", color: "violet" },
        { id: "prayer", name: "Prayer", color: "purple" },
        { id: "reflection", name: "Reflection", color: "pink" },
        { id: "other", name: "Other", color: "gray" },
    ];

    const moods = [
        { id: "grateful", name: "Grateful" },
        { id: "joyful", name: "Joyful" },
        { id: "hopeful", name: "Hopeful" },
        { id: "peaceful", name: "Peaceful" },
        { id: "anxious", name: "Anxious" },
        { id: "sad", name: "Sad" },
        { id: "confused", name: "Confused" },
        { id: "excited", name: "Excited" },
        { id: "other", name: "Other" },
    ];

    // Fetch entries and stats on mount
    useEffect(() => {
        fetchEntries();
        fetchStats();
    }, [filterCategory]);

    const fetchEntries = async () => {
        try {
            setLoading(true);
            setError("");

            const url = filterCategory === "all"
                ? "/api/journal/entries"
                : `/api/journal/entries?category=${filterCategory}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch entries");
            const data = await response.json();
            setJournalEntries(data.entries || []);
        } catch (err: any) {
            setError(err.message || "Failed to load journal entries");
            console.error("Error fetching entries:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch("/api/journal/stats");
            if (!response.ok) throw new Error("Failed to fetch stats");
            const data = await response.json();
            setStats(data);
        } catch (err: any) {
            console.error("Error fetching stats:", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newEntry.trim()) {
            setError("Please provide journal content");
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            setSuccess("");

            const tagArray = tags
                ? tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
                : [];

            const url = editingId
                ? `/api/journal/entries/${editingId}`
                : "/api/journal/entries";

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newTitle.trim() || undefined,
                    content: newEntry.trim(),
                    category: selectedCategory,
                    mood: selectedMood || undefined,
                    tags: tagArray,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to save entry");
            }

            setSuccess(editingId ? "Entry updated successfully!" : "Entry saved successfully!");
            setNewTitle("");
            setNewEntry("");
            setSelectedCategory("general");
            setSelectedMood("");
            setTags("");
            setEditingId(null);
            await fetchEntries();
            await fetchStats();
        } catch (err: any) {
            setError(err.message || "Failed to save entry");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (entry: JournalEntry) => {
        setNewTitle(entry.title || "");
        setNewEntry(entry.content);
        setSelectedCategory(entry.category);
        setSelectedMood(entry.mood || "");
        setTags(entry.tags.join(", "));
        setEditingId(entry.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this journal entry?")) return;

        try {
            const response = await fetch(`/api/journal/entries/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete entry");

            setSuccess("Entry deleted successfully!");
            await fetchEntries();
            await fetchStats();
        } catch (err: any) {
            setError(err.message || "Failed to delete entry");
        }
    };

    const handleClear = () => {
        setNewTitle("");
        setNewEntry("");
        setSelectedCategory("general");
        setSelectedMood("");
        setTags("");
        setEditingId(null);
        setError("");
        setSuccess("");
    };

    const handleExport = async (format: "text" | "json") => {
        try {
            const url = filterCategory === "all"
                ? `/api/journal/export?format=${format}`
                : `/api/journal/export?format=${format}&category=${filterCategory}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to export journal");

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `journal-export.${format === "json" ? "json" : "txt"}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            setSuccess("Journal exported successfully!");
        } catch (err: any) {
            setError(err.message || "Failed to export journal");
        }
    };

    const getCategoryColor = (category: string) => {
        const cat = categories.find((c) => c.id === category);
        return cat?.color || "purple";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                <div className="container-custom py-4">
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link href="/hub/prayer" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back to Prayer Center</span>
                        </Link>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Prayer Journal</h1>
                        <div className="hidden sm:block w-20"></div>
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

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-xs font-medium mb-2">Total Entries</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.totalEntries}</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-xs font-medium mb-2">This Month</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.thisMonth}</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-xs font-medium mb-2">Answered</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.answered}</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-xs font-medium mb-2">Current Streak</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.streak}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* New Entry */}
                        <div className="card">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">
                                {editingId ? "Edit Journal Entry" : "New Journal Entry"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Title (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="Give your entry a title..."
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
                                        maxLength={200}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Category
                                    </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={`px-4 py-2.5 rounded-lg border transition-all duration-200 text-sm font-medium ${selectedCategory === cat.id
                                                        ? "border-orange-500 bg-orange-50 text-orange-700"
                                                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                                                    }`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Your Prayer / Reflection
                                    </label>
                                    <textarea
                                        rows={6}
                                        value={newEntry}
                                        onChange={(e) => setNewEntry(e.target.value)}
                                        placeholder="Write your prayer, thoughts, or reflections here..."
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        maxLength={5000}
                                        required
                                    />
                                    <p className="text-xs text-slate-500 mt-1">{newEntry.length}/5000 characters</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Mood (Optional)
                                        </label>
                                        <select
                                            value={selectedMood}
                                            onChange={(e) => setSelectedMood(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        >
                                            <option value="">Select mood...</option>
                                            {moods.map((mood) => (
                                                <option key={mood.id} value={mood.id}>
                                                    {mood.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Tags (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            placeholder="gratitude, prayer, study..."
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting
                                            ? "Saving..."
                                            : editingId
                                                ? "Update Entry"
                                                : "Save Entry"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Journal Entries */}
                        <div className="card">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">Recent Entries</h2>
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-8 text-slate-500">Loading entries...</div>
                                ) : journalEntries.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500">
                                        No journal entries yet. Create your first entry above!
                                    </div>
                                ) : (
                                    journalEntries.map((entry) => (
                                        <div
                                            key={entry.id}
                                            className="p-4 bg-gradient-to-r from-slate-50 to-orange-50 rounded-lg border border-slate-200 hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                        {entry.category.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1">
                                                        {entry.title && (
                                                            <h3 className="font-bold text-slate-800 mb-1">{entry.title}</h3>
                                                        )}
                                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                                            <span>{entry.date}</span>
                                                            <span>•</span>
                                                            <span>{entry.time}</span>
                                                            {entry.mood && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span className="capitalize">{entry.mood}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(entry)}
                                                        className="text-slate-400 hover:text-blue-600 transition-colors"
                                                        title="Edit entry"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(entry.id)}
                                                        className="text-slate-400 hover:text-red-600 transition-colors"
                                                        title="Delete entry"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-slate-700 text-sm mb-3 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                                            {entry.tags && entry.tags.length > 0 && (
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {entry.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-white rounded-full text-xs font-medium text-slate-600 border border-slate-200"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Quick Tips */}
                        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Journaling Tips</h3>
                            <div className="space-y-3 text-sm text-slate-700">
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">-</span>
                                    <p>Be honest and authentic in your prayers</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">-</span>
                                    <p>Record answered prayers to build faith</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">-</span>
                                    <p>Include Scripture verses that speak to you</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">-</span>
                                    <p>Review past entries to see God&apos;s faithfulness</p>
                                </div>
                            </div>
                        </div>

                        {/* Scripture Inspiration */}
                        <div className="card bg-gradient-to-br from-orange-50 to-amber-50">
                            <h3 className="text-lg font-bold text-slate-800 mb-3">Today&apos;s Inspiration</h3>
                            <div className="p-3 bg-white rounded-lg border border-orange-200">
                                <p className="text-sm text-slate-700 italic mb-2">
                                    &quot;This is the confidence we have in approaching God: that if we ask anything according to his will, he hears us.&quot;
                                </p>
                                <p className="text-xs font-semibold text-orange-600">1 John 5:14</p>
                            </div>
                        </div>

                        {/* Export Options */}
                        <div className="card">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Export Journal</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleExport("text")}
                                    className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                    </svg>
                                    Export as Text
                                </button>
                                <button
                                    onClick={() => handleExport("json")}
                                    className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                    </svg>
                                    Export as JSON
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
