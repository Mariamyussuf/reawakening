"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface Devotional {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    coverImage?: string;
    publishDate: string;
    scheduledDate?: string;
    status: 'draft' | 'scheduled' | 'published';
    tags: string[];
    scripture?: string;
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
        status: "draft" as "draft" | "scheduled" | "published",
        publishDate: "",
        scheduledDate: "",
        scripture: "",
        tags: "",
    });

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>("");
    const [removeCover, setRemoveCover] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDevotional();
    }, [devotionalId]);

    const loadDevotional = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/devotionals/${devotionalId}`);
            if (!response.ok) {
                throw new Error('Failed to load devotional');
            }

            const data = await response.json();
            const dev = data.devotional;
            setDevotional(dev);
            setFormData({
                title: dev.title,
                content: dev.content,
                excerpt: dev.excerpt,
                author: dev.author,
                status: dev.status,
                publishDate: new Date(dev.publishDate).toISOString().split('T')[0],
                scheduledDate: dev.scheduledDate ? new Date(dev.scheduledDate).toISOString().slice(0, 16) : "",
                scripture: dev.scripture || "",
                tags: dev.tags.join(", "),
            });
            if (dev.coverImage) {
                setCoverPreview(dev.coverImage);
            }
        } catch (error) {
            console.error("Error loading devotional:", error);
            setError("Failed to load devotional");
        } finally {
            setLoading(false);
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            setRemoveCover(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.title || !formData.content || !formData.excerpt || !formData.author) {
            setError("Please fill in all required fields");
            return;
        }

        if (formData.status === 'scheduled' && !formData.scheduledDate) {
            setError("Scheduled date is required for scheduled devotionals");
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
            } else {
                formDataToSend.append("scheduledDate", "");
            }
            if (formData.scripture) {
                formDataToSend.append("scripture", formData.scripture);
            } else {
                formDataToSend.append("scripture", "");
            }
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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update devotional");
            }

            router.push("/admin/devotionals");
        } catch (err: any) {
            setError(err.message || "Failed to update devotional");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading devotional...</p>
                </div>
            </div>
        );
    }

    if (!devotional) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
                <div className="text-center">
                    <p className="text-slate-600 mb-4">Devotional not found</p>
                    <Link href="/admin/devotionals" className="btn-primary">
                        Back to Devotionals
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Minimal Header */}
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/admin/devotionals" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Devotionals
                        </Link>
                        <h1 className="text-lg font-semibold text-slate-900">Edit Devotional</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Title *"
                            className="w-full text-4xl font-bold text-slate-900 placeholder:text-slate-400 border-none outline-none focus:ring-0 p-0"
                            required
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <textarea
                            id="excerpt"
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="Excerpt * (Brief summary, max 500 characters)"
                            className="w-full text-lg text-slate-600 placeholder:text-slate-400 border-none outline-none focus:ring-0 p-0 resize-none"
                            rows={2}
                            maxLength={500}
                            required
                        />
                        <p className="mt-2 text-sm text-slate-400">{formData.excerpt.length}/500</p>
                    </div>

                    {/* Content */}
                    <div>
                        <RichTextEditor
                            content={formData.content}
                            onChange={(content) => setFormData({ ...formData, content })}
                            placeholder="Start writing your devotional..."
                        />
                    </div>

                    {/* Metadata Section */}
                    <div className="border-t border-slate-200 pt-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Author */}
                            <div>
                                <label htmlFor="author" className="block text-sm font-medium text-slate-700 mb-2">
                                    Author *
                                </label>
                                <input
                                    type="text"
                                    id="author"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                                    required
                                />
                            </div>

                            {/* Scripture */}
                            <div>
                                <label htmlFor="scripture" className="block text-sm font-medium text-slate-700 mb-2">
                                    Scripture Reference (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="scripture"
                                    value={formData.scripture}
                                    onChange={(e) => setFormData({ ...formData, scripture: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                                    placeholder="e.g., John 3:16"
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-2">
                                Tags (comma-separated)
                            </label>
                            <input
                                type="text"
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                                placeholder="faith, prayer, hope"
                            />
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label htmlFor="cover" className="block text-sm font-medium text-slate-700 mb-2">
                                Cover Image
                            </label>
                            {coverPreview && !removeCover && (
                                <div className="mb-4">
                                    <img src={coverPreview} alt="Cover preview" className="max-w-md rounded-lg shadow-sm mb-2" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRemoveCover(true);
                                            setCoverPreview("");
                                            setCoverImage(null);
                                        }}
                                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Remove cover image
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                id="cover"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleCoverChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                            />
                        </div>

                        {/* Status and Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                                    Status *
                                </label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="publishDate" className="block text-sm font-medium text-slate-700 mb-2">
                                    Publish Date *
                                </label>
                                <input
                                    type="date"
                                    id="publishDate"
                                    value={formData.publishDate}
                                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                                    required
                                />
                            </div>
                            {formData.status === 'scheduled' && (
                                <div>
                                    <label htmlFor="scheduledDate" className="block text-sm font-medium text-slate-700 mb-2">
                                        Scheduled Date *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="scheduledDate"
                                        value={formData.scheduledDate}
                                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                                        required={formData.status === 'scheduled'}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4 pt-4 border-t border-slate-200">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? "Updating..." : "Update Devotional"}
                        </button>
                        <Link 
                            href="/admin/devotionals" 
                            className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    );
}
