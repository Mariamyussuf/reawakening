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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/admin/books" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back to Books Admin</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-800">Upload New Book</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            <main className="container-custom py-8 max-w-4xl mx-auto">
                {/* Success Message */}
                {uploadSuccess && (
                    <div className="card bg-green-50 border-2 border-green-200 mb-6">
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
                    <div className="card bg-red-50 border-2 border-red-200 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">Error</div>
                            <div>
                                <h3 className="font-bold text-red-800">Upload Failed</h3>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="card">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Book Information</h2>

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
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Files */}
                    <div className="space-y-4 mb-6 p-4 bg-slate-50 rounded-lg">
                        <h3 className="font-bold text-slate-800 mb-3">Files</h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                PDF File <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="pdf-file"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                            {pdfFile && (
                                <p className="text-sm text-green-600 mt-2">
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
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            {coverImage && (
                                <p className="text-sm text-green-600 mt-2">
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
                                    className={`px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium ${formData.categories.includes(category)
                                            ? "border-purple-500 bg-purple-50 text-purple-700"
                                            : "border-slate-200 hover:border-slate-300 text-slate-700"
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
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Difficulty Level
                            </label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* Display Options */}
                    <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                        <h3 className="font-bold text-slate-800 mb-3">Display Options</h3>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm text-slate-700">Featured Book (show on homepage)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.popular}
                                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm text-slate-700">Popular Book</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.newRelease}
                                    onChange={(e) => setFormData({ ...formData, newRelease: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
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
                            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            {uploading ? "Uploading..." : "Upload Book"}
                        </button>
                        <Link
                            href="/admin/books"
                            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors text-center"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    );
}
