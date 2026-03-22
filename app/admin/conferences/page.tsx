"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { SerializedConference } from "@/lib/conferences";

interface ConferenceOverview {
    totalConferences: number;
    publishedConferences: number;
    openRegistrations: number;
}

interface ConferencePayload {
    conferences: SerializedConference[];
    overview: ConferenceOverview;
}

interface ConferenceFormState {
    theme: string;
    summary: string;
    venue: string;
    timeLabel: string;
    costLabel: string;
    registrationUrl: string;
    details: string;
    startDate: string;
    endDate: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    isOnline: boolean;
    registrationOpen: boolean;
    featured: boolean;
}

const emptyFormState: ConferenceFormState = {
    theme: "",
    summary: "",
    venue: "",
    timeLabel: "",
    costLabel: "Free (Registration Required)",
    registrationUrl: "",
    details: "",
    startDate: "",
    endDate: "",
    status: "DRAFT",
    isOnline: false,
    registrationOpen: false,
    featured: false,
};

function toDateTimeLocalValue(value: string | null) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const offset = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function extractConferencePayload(payload: any): ConferencePayload {
    const data = payload?.data ?? payload;

    return {
        conferences: Array.isArray(data?.conferences) ? data.conferences : [],
        overview: data?.overview ?? {
            totalConferences: 0,
            publishedConferences: 0,
            openRegistrations: 0,
        },
    };
}

function toFormState(conference: SerializedConference): ConferenceFormState {
    return {
        theme: conference.theme,
        summary: conference.summary,
        venue: conference.venue,
        timeLabel: conference.timeLabel,
        costLabel: conference.costLabel,
        registrationUrl: conference.registrationUrl || "",
        details: conference.details || "",
        startDate: toDateTimeLocalValue(conference.startDate),
        endDate: toDateTimeLocalValue(conference.endDate),
        status: conference.status,
        isOnline: conference.isOnline,
        registrationOpen: conference.registrationOpen,
        featured: conference.featured,
    };
}

function getStatusBadgeClass(status: SerializedConference["status"]) {
    if (status === "PUBLISHED") {
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }

    if (status === "ARCHIVED") {
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }

    return "bg-gold/15 text-gold-dark border border-gold/30";
}

export default function AdminConferencesPage() {
    const [conferences, setConferences] = useState<SerializedConference[]>([]);
    const [overview, setOverview] = useState<ConferenceOverview>({
        totalConferences: 0,
        publishedConferences: 0,
        openRegistrations: 0,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "DRAFT" | "PUBLISHED" | "ARCHIVED">("ALL");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formState, setFormState] = useState<ConferenceFormState>(emptyFormState);

    const isEditing = Boolean(editingId);
    const draftCount = useMemo(
        () => conferences.filter((conference) => conference.status === "DRAFT").length,
        [conferences]
    );

    const loadConferences = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();
            if (statusFilter !== "ALL") {
                params.set("status", statusFilter);
            }

            const response = await fetch(`/api/admin/conferences?${params.toString()}`, {
                cache: "no-store",
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(payload?.error || "Failed to load conferences.");
            }

            const data = extractConferencePayload(payload);
            setConferences(data.conferences);
            setOverview(data.overview);
        } catch (loadError: any) {
            setError(loadError?.message || "Failed to load conferences.");
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        void loadConferences();
    }, [loadConferences]);

    useEffect(() => {
        if (!error) {
            return;
        }

        const timer = setTimeout(() => setError(""), 5000);
        return () => clearTimeout(timer);
    }, [error]);

    useEffect(() => {
        if (!success) {
            return;
        }

        const timer = setTimeout(() => setSuccess(""), 4000);
        return () => clearTimeout(timer);
    }, [success]);

    function resetForm() {
        setEditingId(null);
        setFormState(emptyFormState);
    }

    function updateField<K extends keyof ConferenceFormState>(field: K, value: ConferenceFormState[K]) {
        setFormState((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const response = await fetch(
                editingId ? `/api/admin/conferences/${editingId}` : "/api/admin/conferences",
                {
                    method: editingId ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formState),
                }
            );

            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(payload?.error || "Failed to save conference.");
            }

            setSuccess(editingId ? "Conference updated successfully." : "Conference created successfully.");
            resetForm();
            await loadConferences();
        } catch (submitError: any) {
            setError(submitError?.message || "Failed to save conference.");
        } finally {
            setSaving(false);
        }
    }

    function handleEdit(conference: SerializedConference) {
        setEditingId(conference.id);
        setFormState(toFormState(conference));
        setSuccess("");
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(conference: SerializedConference) {
        if (!confirm(`Delete "${conference.theme}"? This cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/conferences/${conference.id}`, {
                method: "DELETE",
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(payload?.error || "Failed to delete conference.");
            }

            if (editingId === conference.id) {
                resetForm();
            }

            setSuccess("Conference deleted successfully.");
            await loadConferences();
        } catch (deleteError: any) {
            setError(deleteError?.message || "Failed to delete conference.");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream px-6">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                    <p className="font-display text-lg text-deep/70">Loading conferences...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream font-body">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <p className="eyebrow mb-1">Admin Workspace</p>
                        <h1 className="font-display text-3xl text-deep">Conference management</h1>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link href="/conference" className="btn-outline">
                            View Public Page
                        </Link>
                        <Link href="/admin" className="btn-primary">
                            Back to Admin
                        </Link>
                    </div>
                </div>

                <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div className="max-w-2xl">
                            <p className="text-xs text-deep/50 tracking-wide uppercase mb-2">Conference Operations</p>
                            <h2 className="font-display text-2xl sm:text-4xl text-deep mb-3">
                                Manage the next gathering from one place
                            </h2>
                            <p className="text-deep/70 leading-relaxed">
                                Create conference entries, choose which one is featured, and publish the exact details that appear on the public conference page.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-deep p-5 min-w-[220px]">
                            <p className="text-[10px] tracking-[0.2em] uppercase text-gold/70 mb-2">Current Mode</p>
                            <p className="font-display text-xl text-cream">
                                {isEditing ? "Editing conference" : "Create conference"}
                            </p>
                            <p className="text-sm text-cream/60 mt-1">
                                {overview.publishedConferences} published, {overview.openRegistrations} open registrations
                            </p>
                        </div>
                    </div>
                </div>

                {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">{error}</div>}
                {success && <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">{success}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    {[
                        ["Total Conferences", `${overview.totalConferences}`, "All conference records"],
                        ["Published", `${overview.publishedConferences}`, "Visible on the public site"],
                        ["Open Registration", `${overview.openRegistrations}`, "Currently accepting signups"],
                        ["Drafts", `${draftCount}`, "Still being prepared"],
                    ].map(([label, value, detail], index) => (
                        <div
                            key={label}
                            className={`rounded-2xl border p-5 shadow-sm ${
                                index === 1
                                    ? "bg-deep border-deep text-cream"
                                    : index === 2
                                        ? "bg-gold/15 border-gold/30 text-deep"
                                        : "bg-warm-white border-mid/20 text-deep"
                            }`}
                        >
                            <p className={`text-xs tracking-wide uppercase mb-2 ${index === 1 ? "text-gold/75" : "text-deep/50"}`}>{label}</p>
                            <p className="font-display text-3xl mb-2">{value}</p>
                            <p className={`text-sm leading-relaxed ${index === 1 ? "text-cream/70" : "text-deep/70"}`}>{detail}</p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                            <div>
                                <p className="eyebrow mb-2">Editor</p>
                                <h2 className="font-display text-2xl text-deep">
                                    {isEditing ? "Update conference" : "Create a conference"}
                                </h2>
                            </div>

                            {isEditing && (
                                <button type="button" onClick={resetForm} className="btn-outline">
                                    Cancel Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="md:col-span-2">
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Theme</span>
                                    <input
                                        value={formState.theme}
                                        onChange={(event) => updateField("theme", event.target.value)}
                                        className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                        placeholder="Anchored in Hope"
                                        required
                                    />
                                </label>

                                <label className="md:col-span-2">
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Summary</span>
                                    <textarea
                                        value={formState.summary}
                                        onChange={(event) => updateField("summary", event.target.value)}
                                        className="w-full min-h-[110px] rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 resize-none"
                                        placeholder="Join us for a time of spiritual renewal and growth."
                                        required
                                    />
                                </label>

                                <label>
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Start Date</span>
                                    <input
                                        type="datetime-local"
                                        value={formState.startDate}
                                        onChange={(event) => updateField("startDate", event.target.value)}
                                        className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                        required
                                    />
                                </label>

                                <label>
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">End Date</span>
                                    <input
                                        type="datetime-local"
                                        value={formState.endDate}
                                        onChange={(event) => updateField("endDate", event.target.value)}
                                        className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                    />
                                </label>

                                <label>
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Time Label</span>
                                    <input
                                        value={formState.timeLabel}
                                        onChange={(event) => updateField("timeLabel", event.target.value)}
                                        className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                        placeholder="9:00 AM - 5:00 PM"
                                        required
                                    />
                                </label>

                                <label>
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Venue</span>
                                    <input
                                        value={formState.venue}
                                        onChange={(event) => updateField("venue", event.target.value)}
                                        className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                        placeholder="Community Hall, Campus Center"
                                        required
                                    />
                                </label>

                                <label>
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Cost Label</span>
                                    <input
                                        value={formState.costLabel}
                                        onChange={(event) => updateField("costLabel", event.target.value)}
                                        className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                    />
                                </label>

                                <label>
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Status</span>
                                    <select
                                        value={formState.status}
                                        onChange={(event) => updateField("status", event.target.value as ConferenceFormState["status"])}
                                        className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                    >
                                        <option value="DRAFT">Draft</option>
                                        <option value="PUBLISHED">Published</option>
                                        <option value="ARCHIVED">Archived</option>
                                    </select>
                                </label>

                                <label className="md:col-span-2">
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Registration URL</span>
                                    <input
                                        value={formState.registrationUrl}
                                        onChange={(event) => updateField("registrationUrl", event.target.value)}
                                        className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                        placeholder="https://..."
                                    />
                                </label>

                                <label className="md:col-span-2">
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Extra Details</span>
                                    <textarea
                                        value={formState.details}
                                        onChange={(event) => updateField("details", event.target.value)}
                                        className="w-full min-h-[120px] rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 resize-none"
                                        placeholder="Add speaker notes, registration guidance, or a short admin summary."
                                    />
                                </label>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <label className="flex items-center gap-3 rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-sm text-deep">
                                    <input
                                        type="checkbox"
                                        checked={formState.registrationOpen}
                                        onChange={(event) => updateField("registrationOpen", event.target.checked)}
                                        className="h-4 w-4 rounded border-mid/30 text-gold focus:ring-gold/30"
                                    />
                                    Registration Open
                                </label>

                                <label className="flex items-center gap-3 rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-sm text-deep">
                                    <input
                                        type="checkbox"
                                        checked={formState.isOnline}
                                        onChange={(event) => updateField("isOnline", event.target.checked)}
                                        className="h-4 w-4 rounded border-mid/30 text-gold focus:ring-gold/30"
                                    />
                                    Online Event
                                </label>

                                <label className="flex items-center gap-3 rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-sm text-deep">
                                    <input
                                        type="checkbox"
                                        checked={formState.featured}
                                        onChange={(event) => updateField("featured", event.target.checked)}
                                        className="h-4 w-4 rounded border-mid/30 text-gold focus:ring-gold/30"
                                    />
                                    Feature on Public Page
                                </label>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button type="submit" className="btn-primary" disabled={saving}>
                                    {saving ? "Saving..." : isEditing ? "Update Conference" : "Create Conference"}
                                </button>
                                <button type="button" onClick={resetForm} className="btn-outline">
                                    Clear Form
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                            <div>
                                <p className="eyebrow mb-2">Conference List</p>
                                <h2 className="font-display text-2xl text-deep">Saved conferences</h2>
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                                className="rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-sm text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                            >
                                <option value="ALL">All statuses</option>
                                <option value="DRAFT">Drafts</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="ARCHIVED">Archived</option>
                            </select>
                        </div>

                        {conferences.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-mid/30 bg-cream px-6 py-16 text-center">
                                <p className="eyebrow mb-3">No Conferences Yet</p>
                                <h3 className="font-display text-2xl text-deep mb-2">Create the first conference record</h3>
                                <p className="text-deep/65 leading-relaxed">
                                    Once you save one here, the public conference page can start reading from live data.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {conferences.map((conference) => (
                                    <div
                                        key={conference.id}
                                        className="rounded-2xl border border-mid/20 bg-cream p-5 hover:border-gold/35 hover:shadow-lift transition-all"
                                    >
                                        <div className="flex flex-col gap-5">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <h3 className="font-display text-2xl text-deep">{conference.theme}</h3>
                                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getStatusBadgeClass(conference.status)}`}>
                                                            {conference.status}
                                                        </span>
                                                        {conference.featured && (
                                                            <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] bg-deep text-cream">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-deep/70 leading-relaxed mb-3">{conference.summary}</p>
                                                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-deep/55">
                                                        <span>{conference.dateLabel}</span>
                                                        <span>{conference.timeLabel}</span>
                                                        <span>{conference.venue}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <button type="button" onClick={() => handleEdit(conference)} className="btn-outline">
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(conference)}
                                                        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 text-sm">
                                                <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-3 text-deep/70">
                                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-1">Registration</span>
                                                    {conference.registrationOpen ? "Open" : "Closed"}
                                                </div>
                                                <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-3 text-deep/70">
                                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-1">Format</span>
                                                    {conference.isOnline ? "Online" : "In person"}
                                                </div>
                                                <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-3 text-deep/70">
                                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-1">Cost</span>
                                                    {conference.costLabel}
                                                </div>
                                                <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-3 text-deep/70">
                                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-1">Public Link</span>
                                                    <Link href="/conference" className="text-gold-dark hover:text-gold transition-colors">
                                                        Open page
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
