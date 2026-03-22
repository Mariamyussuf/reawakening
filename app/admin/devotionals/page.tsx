"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DevotionalStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED";
type StatusFilter = "ALL" | "DRAFT" | "SCHEDULED" | "PUBLISHED";

interface Devotional {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    coverImage?: string | null;
    publishDate: string;
    scheduledDate?: string | null;
    status: DevotionalStatus;
    tags: string[];
    scripture?: string | null;
}

function normalizeDevotionalStatus(value: string | null | undefined): DevotionalStatus {
    const normalizedValue = value?.toUpperCase();

    if (normalizedValue === "PUBLISHED" || normalizedValue === "SCHEDULED") {
        return normalizedValue;
    }

    return "DRAFT";
}

function extractDevotionals(payload: any): Devotional[] {
    const data = payload?.data ?? payload;

    if (!Array.isArray(data?.devotionals)) {
        return [];
    }

    return data.devotionals.map((devotional: any) => ({
        ...devotional,
        status: normalizeDevotionalStatus(devotional?.status),
        tags: Array.isArray(devotional?.tags) ? devotional.tags : [],
    }));
}

function requiresDatabaseSetup(payload: any): boolean {
    return Boolean(payload?.needsDatabaseSetup || payload?.data?.needsDatabaseSetup);
}

function getStatusBadgeClass(status: DevotionalStatus) {
    if (status === "PUBLISHED") {
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }

    if (status === "SCHEDULED") {
        return "bg-deep text-cream border border-deep";
    }

    return "bg-gold/15 text-gold-dark border border-gold/30";
}

export default function AdminDevotionalsPage() {
    const [devotionals, setDevotionals] = useState<Devotional[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [setupRequired, setSetupRequired] = useState(false);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

    useEffect(() => {
        void loadDevotionals();
    }, [statusFilter]);

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

    const publishedCount = useMemo(
        () => devotionals.filter((devotional) => devotional.status === "PUBLISHED").length,
        [devotionals]
    );
    const scheduledCount = useMemo(
        () => devotionals.filter((devotional) => devotional.status === "SCHEDULED").length,
        [devotionals]
    );
    const draftCount = useMemo(
        () => devotionals.filter((devotional) => devotional.status === "DRAFT").length,
        [devotionals]
    );

    async function loadDevotionals() {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();
            if (statusFilter !== "ALL") {
                params.set("status", statusFilter.toLowerCase());
            }

            const response = await fetch(`/api/admin/devotionals?${params.toString()}`, {
                cache: "no-store",
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(payload?.error || "Failed to load devotionals");
            }

            const needsDatabaseSetup = requiresDatabaseSetup(payload);
            setSetupRequired(needsDatabaseSetup);
            setDevotionals(extractDevotionals(payload));

            if (needsDatabaseSetup) {
                setError("Devotional data is not available in this environment yet. Run the latest production database schema update.");
            }
        } catch (loadError: any) {
            setSetupRequired(false);
            setError(loadError?.message || "Failed to load devotionals");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(devotional: Devotional) {
        if (!confirm(`Delete "${devotional.title}"? This cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/devotionals/${devotional.id}`, {
                method: "DELETE",
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(payload?.error || "Failed to delete devotional");
            }

            setSuccess("Devotional deleted successfully.");
            await loadDevotionals();
        } catch (deleteError: any) {
            setError(deleteError?.message || "Failed to delete devotional");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream px-6">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                    <p className="font-display text-lg text-deep/70">Loading devotionals...</p>
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
                        <h1 className="font-display text-3xl text-deep">Devotional management</h1>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link href="/admin/devotionals/create" className="btn-primary">
                            New Devotional
                        </Link>
                        <Link href="/admin" className="btn-outline">
                            Back to Admin
                        </Link>
                    </div>
                </div>

                <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div className="max-w-2xl">
                            <p className="text-xs text-deep/50 tracking-wide uppercase mb-2">Devotional Flow</p>
                            <h2 className="font-display text-2xl sm:text-4xl text-deep mb-3">
                                Keep the reading journey steady and clear
                            </h2>
                            <p className="text-deep/70 leading-relaxed">
                                Review drafts, schedule upcoming devotionals, and publish the pieces that should reach readers right away.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-deep p-5 min-w-[220px]">
                            <p className="text-[10px] tracking-[0.2em] uppercase text-gold/70 mb-2">Current Filter</p>
                            <p className="font-display text-xl text-cream">
                                {statusFilter === "ALL" ? "All devotionals" : `${statusFilter.toLowerCase()} devotionals`}
                            </p>
                            <p className="text-sm text-cream/60 mt-1">
                                {publishedCount} published, {scheduledCount} scheduled
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    {[
                        ["Total Devotionals", `${devotionals.length}`, "All devotional records in the selected view"],
                        ["Published", `${publishedCount}`, "Live and visible to readers"],
                        ["Scheduled", `${scheduledCount}`, "Prepared for future release"],
                        ["Drafts", `${draftCount}`, "Still being refined"],
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

                <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                        <div>
                            <p className="eyebrow mb-2">Devotional Library</p>
                            <h2 className="font-display text-2xl text-deep">Saved devotionals</h2>
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                            className="rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-sm text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                        >
                            <option value="ALL">All statuses</option>
                            <option value="DRAFT">Drafts</option>
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="PUBLISHED">Published</option>
                        </select>
                    </div>

                    {devotionals.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-mid/30 bg-cream px-6 py-16 text-center">
                            <p className="eyebrow mb-3">
                                {setupRequired ? "Database Setup Required" : "No Devotionals Yet"}
                            </p>
                            <h3 className="font-display text-2xl text-deep mb-2">
                                {setupRequired ? "Devotional data is not ready in this environment" : "Create the first devotional record"}
                            </h3>
                            <p className="text-deep/65 leading-relaxed mb-6">
                                {setupRequired
                                    ? "Sync the latest Prisma schema to the production database, then reload this page."
                                    : "Once you publish one here, readers will be able to discover it from the devotional experience."}
                            </p>
                            {!setupRequired && (
                                <Link href="/admin/devotionals/create" className="btn-primary inline-block">
                                    Create Devotional
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {devotionals.map((devotional) => (
                                <article
                                    key={devotional.id}
                                    className="rounded-2xl border border-mid/20 bg-cream p-5 hover:border-gold/35 hover:shadow-lift transition-all"
                                >
                                    <div className="flex flex-col gap-5">
                                        {devotional.coverImage && (
                                            <img
                                                src={devotional.coverImage}
                                                alt={devotional.title}
                                                className="h-48 w-full rounded-2xl object-cover border border-mid/15"
                                            />
                                        )}

                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <h3 className="font-display text-2xl text-deep">{devotional.title}</h3>
                                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getStatusBadgeClass(devotional.status)}`}>
                                                        {devotional.status}
                                                    </span>
                                                </div>
                                                <p className="text-deep/70 leading-relaxed mb-3">{devotional.excerpt}</p>
                                                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-deep/55">
                                                    <span>By {devotional.author}</span>
                                                    <span>
                                                        {devotional.status === "SCHEDULED" && devotional.scheduledDate
                                                            ? `Scheduled ${new Date(devotional.scheduledDate).toLocaleDateString()}`
                                                            : `Published ${new Date(devotional.publishDate).toLocaleDateString()}`}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <Link href={`/admin/devotionals/${devotional.id}/edit`} className="btn-outline">
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(devotional)}
                                                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 text-sm">
                                            <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-3 text-deep/70">
                                                <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-1">Scripture</span>
                                                {devotional.scripture || "Not provided"}
                                            </div>
                                            <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-3 text-deep/70">
                                                <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-1">Tags</span>
                                                {devotional.tags.length > 0 ? devotional.tags.slice(0, 3).join(", ") : "No tags yet"}
                                            </div>
                                            <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-3 text-deep/70">
                                                <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-1">Reader View</span>
                                                <Link href="/hub/devotionals" className="text-gold-dark hover:text-gold transition-colors">
                                                    Open devotionals
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
