"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import RichTextEditor from "@/components/admin/RichTextEditor";

type FormStatus = "draft" | "scheduled" | "published";

interface Devotional {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    coverImage?: string | null;
    publishDate: string;
    scheduledDate?: string | null;
    status: string;
    tags: string[];
    scripture?: string | null;
}

function normalizeFormStatus(value: string | null | undefined): FormStatus {
    const normalizedValue = value?.toLowerCase();

    if (normalizedValue === "published" || normalizedValue === "scheduled") {
        return normalizedValue;
    }

    return "draft";
}

export default function EditDevotionalPage() {
    const router = useRouter();
    const params = useParams();
    const devotionalId = params.id as string;

    const [devotional, setDevotional] = useState<Devotional | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        excerpt: "",
        author: "",
        status: "draft" as FormStatus,
        publishDate: "",
        scheduledDate: "",
        scripture: "",
        tags: "",
    });
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState("");
    const [removeCover, setRemoveCover] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        void loadDevotional();
    }, [devotionalId]);

    async function loadDevotional() {
        try {
            setLoading(true);

            const response = await fetch(`/api/admin/devotionals/${devotionalId}`, {
                cache: "no-store",
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(payload?.error || "Failed to load devotional");
            }

            const dev = (payload?.data?.devotional ?? payload?.devotional ?? null) as Devotional | null;

            if (!dev) {
                throw new Error("Devotional not found");
            }

            setDevotional(dev);
            setFormData({
                title: dev.title,
                content: dev.content,
                excerpt: dev.excerpt,
                author: dev.author,
                status: normalizeFormStatus(dev.status),
                publishDate: new Date(dev.publishDate).toISOString().split("T")[0],
                scheduledDate: dev.scheduledDate ? new Date(dev.scheduledDate).toISOString().slice(0, 16) : "",
                scripture: dev.scripture || "",
                tags: Array.isArray(dev.tags) ? dev.tags.join(", ") : "",
            });

            if (dev.coverImage) {
                setCoverPreview(dev.coverImage);
            }
        } catch (loadError: any) {
            setError(loadError?.message || "Failed to load devotional");
        } finally {
            setLoading(false);
        }
    }

    function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setCoverImage(file);
        setRemoveCover(false);

        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setError("");

        if (!formData.title || !formData.content || !formData.excerpt || !formData.author) {
            setError("Please fill in all required fields.");
            return;
        }

        if (formData.status === "scheduled" && !formData.scheduledDate) {
            setError("Scheduled date is required for scheduled devotionals.");
            return;
        }

        setUploading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("content", formData.content);
            formDataToSend.append("excerpt", formData.excerpt);
            formDataToSend.append("author", formData.author);
            formDataToSend.append("status", formData.status);
            formDataToSend.append("publishDate", formData.publishDate);
            formDataToSend.append("scheduledDate", formData.scheduledDate || "");
            formDataToSend.append("scripture", formData.scripture || "");

            if (formData.tags) {
                formDataToSend.append("tags", formData.tags);
            }

            if (coverImage) {
                formDataToSend.append("cover", coverImage);
            }

            if (removeCover) {
                formDataToSend.append("removeCover", "true");
            }

            const response = await fetch(`/api/admin/devotionals/${devotionalId}`, {
                method: "PUT",
                body: formDataToSend,
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(payload?.error || "Failed to update devotional");
            }

            router.push("/admin/devotionals");
        } catch (submitError: any) {
            setError(submitError?.message || "Failed to update devotional");
        } finally {
            setUploading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream px-6">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                    <p className="font-display text-lg text-deep/70">Loading devotional...</p>
                </div>
            </div>
        );
    }

    if (!devotional) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center px-6">
                <div className="w-full max-w-lg rounded-3xl border border-mid/20 bg-warm-white p-8 shadow-sm text-center">
                    <p className="eyebrow mb-3">Unavailable</p>
                    <h1 className="font-display text-3xl text-deep mb-4">Devotional not found</h1>
                    <p className="text-deep/70 leading-relaxed mb-8">
                        The devotional you are trying to edit could not be loaded in this environment.
                    </p>
                    <Link href="/admin/devotionals" className="btn-primary">
                        Back to Devotionals
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream font-body">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <p className="eyebrow mb-1">Admin Workspace</p>
                        <h1 className="font-display text-3xl text-deep">Edit devotional</h1>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link href="/admin/devotionals" className="btn-outline">
                            Back to Devotionals
                        </Link>
                        <Link href="/admin" className="btn-primary">
                            Back to Admin
                        </Link>
                    </div>
                </div>

                <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div className="max-w-2xl">
                            <p className="text-xs text-deep/50 tracking-wide uppercase mb-2">Devotional Editor</p>
                            <h2 className="font-display text-2xl sm:text-4xl text-deep mb-3">
                                Refine the message without losing the thread
                            </h2>
                            <p className="text-deep/70 leading-relaxed">
                                Update the content, adjust the release settings, and keep the devotional aligned with the reading experience on the platform.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-deep p-5 min-w-[220px]">
                            <p className="text-[10px] tracking-[0.2em] uppercase text-gold/70 mb-2">Current Record</p>
                            <p className="font-display text-xl text-cream line-clamp-2">{devotional.title}</p>
                            <p className="text-sm text-cream/60 mt-1">
                                Status: {formData.status}
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 shadow-sm">
                        <div className="mb-6">
                            <p className="eyebrow mb-2">Core Content</p>
                            <h2 className="font-display text-2xl text-deep">Message details</h2>
                        </div>

                        <div className="space-y-5">
                            <label className="block">
                                <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Title</span>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                                    className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Excerpt</span>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(event) => setFormData({ ...formData, excerpt: event.target.value })}
                                    className="w-full min-h-[100px] rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 resize-none"
                                    maxLength={500}
                                    required
                                />
                                <p className="mt-2 text-sm text-deep/45">{formData.excerpt.length}/500</p>
                            </label>

                            <div>
                                <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Content</span>
                                <div className="rounded-3xl border border-mid/20 overflow-hidden">
                                    <RichTextEditor
                                        content={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
                                        placeholder="Continue refining your devotional..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                        <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 shadow-sm">
                            <div className="mb-6">
                                <p className="eyebrow mb-2">Metadata</p>
                                <h2 className="font-display text-2xl text-deep">Context and references</h2>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <label>
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Author</span>
                                    <input
                                        type="text"
                                        value={formData.author}
                                        onChange={(event) => setFormData({ ...formData, author: event.target.value })}
                                        className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                        required
                                    />
                                </label>

                                <label>
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Scripture Reference</span>
                                    <input
                                        type="text"
                                        value={formData.scripture}
                                        onChange={(event) => setFormData({ ...formData, scripture: event.target.value })}
                                        placeholder="e.g., Psalm 46:1"
                                        className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                    />
                                </label>

                                <label className="md:col-span-2">
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Tags</span>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(event) => setFormData({ ...formData, tags: event.target.value })}
                                        placeholder="faith, endurance, hope"
                                        className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 shadow-sm">
                            <div className="mb-6">
                                <p className="eyebrow mb-2">Publishing</p>
                                <h2 className="font-display text-2xl text-deep">Release settings</h2>
                            </div>

                            <div className="space-y-5">
                                {coverPreview && !removeCover && (
                                    <img
                                        src={coverPreview}
                                        alt="Cover preview"
                                        className="h-48 w-full rounded-2xl object-cover border border-mid/15"
                                    />
                                )}

                                {coverPreview && !removeCover && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRemoveCover(true);
                                            setCoverPreview("");
                                            setCoverImage(null);
                                        }}
                                        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                                    >
                                        Remove cover image
                                    </button>
                                )}

                                <label className="block">
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Replace Cover Image</span>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleCoverChange}
                                        className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep file:mr-4 file:rounded-xl file:border-0 file:bg-deep file:px-4 file:py-2 file:text-sm file:font-medium file:text-cream hover:file:bg-deep/90"
                                    />
                                </label>

                                <label className="block">
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Status</span>
                                    <select
                                        value={formData.status}
                                        onChange={(event) => setFormData({ ...formData, status: event.target.value as FormStatus })}
                                        className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="scheduled">Scheduled</option>
                                        <option value="published">Published</option>
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Publish Date</span>
                                    <input
                                        type="date"
                                        value={formData.publishDate}
                                        onChange={(event) => setFormData({ ...formData, publishDate: event.target.value })}
                                        className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                        required
                                    />
                                </label>

                                {formData.status === "scheduled" && (
                                    <label className="block">
                                        <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Scheduled Date</span>
                                        <input
                                            type="datetime-local"
                                            value={formData.scheduledDate}
                                            onChange={(event) => setFormData({ ...formData, scheduledDate: event.target.value })}
                                            className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                            required
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button type="submit" className="btn-primary" disabled={uploading}>
                            {uploading ? "Updating..." : "Update Devotional"}
                        </button>
                        <Link href="/admin/devotionals" className="btn-outline">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
