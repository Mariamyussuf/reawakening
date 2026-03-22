"use client";

import Link from "next/link";
import { useState } from "react";
import { BookCategory } from "@/models/Book";

export default function AdminUploadBookPage() {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        publishYear: "",
        publisher: "",
        isbn: "",
        language: "en",
        difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
        categories: [] as BookCategory[],
        tags: "",
        featured: false,
        popular: false,
        newRelease: true,
    });

    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState("");

    const allCategories = Object.values(BookCategory);

    const handleCategoryToggle = (category: BookCategory) => {
        setFormData((prev) => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter((c) => c !== category)
                : [...prev.categories, category],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setUploadSuccess(false);

        // Validation
        if (!formData.title || !formData.author || !formData.description) {
            setError("Please fill in all required fields (Title, Author, Description)");
            return;
        }

        if (!pdfFile) {
            setError("Please select a PDF file to upload");
            return;
        }

        if (formData.categories.length === 0) {
            setError("Please select at least one category");
            return;
        }

        setUploading(true);

        try {
            const formDataToSend = new FormData();

            // Add PDF file
            formDataToSend.append("pdf", pdfFile);

            // Add cover image if provided
            if (coverImage) {
                formDataToSend.append("cover", coverImage);
            }

            // Add metadata
            formDataToSend.append("metadata", JSON.stringify({
                ...formData,
                tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
                publishYear: formData.publishYear ? parseInt(formData.publishYear) : undefined,
            }));

            const response = await fetch("/api/admin/books/upload", {
                method: "POST",
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Upload failed");
            }

            const result = await response.json();
            console.log("Upload successful:", result);

            setUploadSuccess(true);

            // Reset form
            setFormData({
                title: "",
                author: "",
                description: "",
                publishYear: "",
                publisher: "",
                isbn: "",
                language: "en",
                difficulty: "beginner",
                categories: [],
                tags: "",
                featured: false,
                popular: false,
                newRelease: true,
            });
            setPdfFile(null);
            setCoverImage(null);

            // Clear file inputs
            const pdfInput = document.getElementById("pdf-file") as HTMLInputElement;
            const coverInput = document.getElementById("cover-image") as HTMLInputElement;
            if (pdfInput) pdfInput.value = "";
            if (coverInput) coverInput.value = "";

        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.message || "Failed to upload book. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream font-body">
            {/* Header */}
            <header className="border-b border-mid/20 bg-warm-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
                    <div className="flex items-center justify-between">
                        <Link href="/admin/books" className="flex items-center space-x-2 text-deep/60 hover:text-deep">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back to Books Admin</span>
                        </Link>
                        <h1 className="font-display text-2xl text-deep">Upload New Book</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                {/* Success Message */}
                {uploadSuccess && (
                    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 mb-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">Done</div>
                            <div>
                                <h3 className="font-bold text-green-800">Book Uploaded Successfully!</h3>
                                <p className="text-green-700 text-sm">The book has been added to the library.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 mb-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">Error</div>
                            <div>
                                <h3 className="font-bold text-red-800">Upload Failed</h3>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="rounded-3xl border border-mid/20 bg-warm-white p-6 shadow-sm">
                    <p className="eyebrow mb-2">Library Intake</p>
                    <h2 className="text-2xl font-display text-deep mb-6">Book Information</h2>

                    {/* Basic Info */}
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Mere Christianity"
                                className="w-full px-4 py-3 border border-mid/20 bg-cream rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold/40 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Author <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                placeholder="e.g., C.S. Lewis"
                                className="w-full px-4 py-3 border border-mid/20 bg-cream rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold/40 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of the book..."
                                className="w-full px-4 py-3 border border-mid/20 bg-cream rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold/40 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Files */}
                    <div className="space-y-4 mb-6 p-5 bg-cream border border-mid/15 rounded-2xl">
                        <h3 className="font-display text-xl text-deep mb-3">Files</h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                PDF File <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="pdf-file"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-3 border border-mid/20 bg-warm-white rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold/40 focus:outline-none"
                                required
                            />
                            {pdfFile && (
                                <p className="text-sm text-emerald-700 mt-2">
                                    Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Cover Image (Optional)
                            </label>
                            <input
                                id="cover-image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                                className="w-full px-4 py-3 border border-mid/20 bg-warm-white rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold/40 focus:outline-none"
                            />
                            {coverImage && (
                                <p className="text-sm text-emerald-700 mt-2">
                                    Selected: {coverImage.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Categories <span className="text-red-500">*</span> (Select at least one)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {allCategories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => handleCategoryToggle(category)}
                                    className={`px-3 py-2 rounded-2xl border transition-all text-sm font-medium ${formData.categories.includes(category)
                                            ? "border-deep bg-deep text-cream"
                                            : "border-mid/20 bg-cream hover:border-gold/30 text-deep/75"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-slate-500 mt-2">
                            Selected: {formData.categories.length} {formData.categories.length === 1 ? "category" : "categories"}
                        </p>
                    </div>

                    {/* Additional Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Publish Year
                            </label>
                            <input
                                type="number"
                                value={formData.publishYear}
                                onChange={(e) => setFormData({ ...formData, publishYear: e.target.value })}
                                placeholder="e.g., 2020"
                                className="w-full px-4 py-3 border border-mid/20 bg-cream rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold/40 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Publisher
                            </label>
                            <input
                                type="text"
                                value={formData.publisher}
                                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                                placeholder="e.g., Zondervan"
                                className="w-full px-4 py-3 border border-mid/20 bg-cream rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold/40 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                ISBN
                            </label>
                            <input
                                type="text"
                                value={formData.isbn}
                                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                placeholder="e.g., 978-0-06-065292-0"
                                className="w-full px-4 py-3 border border-mid/20 bg-cream rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold/40 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Difficulty Level
                            </label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                                className="w-full px-4 py-3 border border-mid/20 bg-cream rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold/40 focus:outline-none"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="e.g., faith, apologetics, classic"
                            className="w-full px-4 py-3 border border-mid/20 bg-cream rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold/40 focus:outline-none"
                        />
                    </div>

                    {/* Display Options */}
                    <div className="mb-6 p-5 bg-cream border border-mid/15 rounded-2xl">
                        <h3 className="font-display text-xl text-deep mb-3">Display Options</h3>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-4 h-4 rounded border-mid/30 text-gold focus:ring-gold/30"
                                />
                                <span className="text-sm text-slate-700">Featured Book (show on homepage)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.popular}
                                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                                    className="w-4 h-4 rounded border-mid/30 text-gold focus:ring-gold/30"
                                />
                                <span className="text-sm text-slate-700">Popular Book</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.newRelease}
                                    onChange={(e) => setFormData({ ...formData, newRelease: e.target.checked })}
                                    className="w-4 h-4 rounded border-mid/30 text-gold focus:ring-gold/30"
                                />
                                <span className="text-sm text-slate-700">New Release</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="flex-1 px-6 py-3 bg-deep text-cream rounded-2xl font-semibold hover:bg-deep/90 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            {uploading ? "Uploading..." : "Upload Book"}
                        </button>
                        <Link
                            href="/admin/books"
                            className="px-6 py-3 bg-cream text-deep rounded-2xl font-semibold border border-mid/20 hover:bg-warm-white transition-colors text-center"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    );
}
