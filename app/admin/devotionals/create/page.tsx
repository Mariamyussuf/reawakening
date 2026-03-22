"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import RichTextEditor from "@/components/admin/RichTextEditor";

export default function CreateDevotionalPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        excerpt: "",
        author: "",
        status: "draft" as "draft" | "scheduled" | "published",
        publishDate: new Date().toISOString().split("T")[0],
        scheduledDate: "",
        scripture: "",
        tags: "",
    });
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setCoverImage(file);

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

            if (formData.scheduledDate) {
                formDataToSend.append("scheduledDate", formData.scheduledDate);
            }

            if (formData.scripture) {
                formDataToSend.append("scripture", formData.scripture);
            }

            if (formData.tags) {
                formDataToSend.append("tags", formData.tags);
            }

            if (coverImage) {
                formDataToSend.append("cover", coverImage);
            }

            const response = await fetch("/api/admin/devotionals", {
                method: "POST",
                body: formDataToSend,
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(payload?.error || "Failed to create devotional");
            }

            router.push("/admin/devotionals");
        } catch (submitError: any) {
            setError(submitError?.message || "Failed to create devotional");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="min-h-screen bg-cream font-body">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <p className="eyebrow mb-1">Admin Workspace</p>
                        <h1 className="font-display text-3xl text-deep">Create devotional</h1>
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
                                Shape the next message with clarity and care
                            </h2>
                            <p className="text-deep/70 leading-relaxed">
                                Write the core message, choose how it should be released, and keep the devotional experience consistent for readers.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-deep p-5 min-w-[220px]">
                            <p className="text-[10px] tracking-[0.2em] uppercase text-gold/70 mb-2">Publishing Mode</p>
                            <p className="font-display text-xl text-cream">
                                {formData.status === "published" ? "Publish now" : formData.status === "scheduled" ? "Schedule release" : "Save draft"}
                            </p>
                            <p className="text-sm text-cream/60 mt-1">
                                {coverPreview ? "Cover image ready" : "No cover image selected"}
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
                                    placeholder="A steady heart in uncertain seasons"
                                    className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Excerpt</span>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(event) => setFormData({ ...formData, excerpt: event.target.value })}
                                    placeholder="A short summary readers will see before opening the devotional."
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
                                        placeholder="Start writing your devotional..."
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
                                        placeholder="e.g., John 15:5"
                                        className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                    />
                                </label>

                                <label className="md:col-span-2">
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Tags</span>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(event) => setFormData({ ...formData, tags: event.target.value })}
                                        placeholder="faith, prayer, hope"
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
                                <label className="block">
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Cover Image</span>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleCoverChange}
                                        className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep file:mr-4 file:rounded-xl file:border-0 file:bg-deep file:px-4 file:py-2 file:text-sm file:font-medium file:text-cream hover:file:bg-deep/90"
                                    />
                                </label>

                                {coverPreview && (
                                    <img
                                        src={coverPreview}
                                        alt="Cover preview"
                                        className="h-48 w-full rounded-2xl object-cover border border-mid/15"
                                    />
                                )}

                                <label className="block">
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Status</span>
                                    <select
                                        value={formData.status}
                                        onChange={(event) => setFormData({ ...formData, status: event.target.value as "draft" | "scheduled" | "published" })}
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
                            {uploading ? "Creating..." : "Create Devotional"}
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
