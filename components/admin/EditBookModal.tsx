"use client";

import { useState, useEffect } from "react";
import { Book, BookCategory } from "@/models/Book";

interface EditBookModalProps {
    book: Book | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export default function EditBookModal({ book, isOpen, onClose, onSave }: EditBookModalProps) {
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
        newRelease: false,
    });

    const [newPdfFile, seteewPdfFile] = useState<File | null>(null);
    const [newCoverImage, seteewCoverImage] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const allCategories = Object.values(BookCategory);

    useEffect(() => {
        if (book && isOpen) {
            setFormData({
                title: book.title || "",
                author: book.author || "",
                description: book.description || "",
                publishYear: book.publishYear .toString() || "",
                publisher: book.publisher || "",
                isbn: book.isbn || "",
                language: book.language || "en",
                difficulty: book.difficulty || "beginner",
                categories: book.categories || [],
                tags: book.tags .join(", ") || "",
                featured: book.featured || false,
                popular: book.popular || false,
                newRelease: book.newRelease || false,
            });
            seteewPdfFile(null);
            seteewCoverImage(null);
            setError("");
            setSuccess("");
        }
    }, [book, isOpen]);

    const handleCategoryToggle = (category: BookCategory) => {
        setFormData((prev) => ({
            ...prev,
            categories: prev.categories.includes(category)
                  prev.categories.filter((c) => c !== category)
                : [...prev.categories, category],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!book) return;

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            // If new files are selected, upload them first
            let pdfUrl = book.pdfUrl;
            let coverImage = book.coverImage;

            if (newPdfFile || newCoverImage) {
                const formDataToSend = new FormData();
                if (newPdfFile) formDataToSend.append("pdf", newPdfFile);
                if (newCoverImage) formDataToSend.append("cover", newCoverImage);
                formDataToSend.append("bookId", book.id);
                formDataToSend.append("replace", "true");

                const fileResponse = await fetch("/api/admin/books/upload/replace", {
                    method: "POST",
                    body: formDataToSend,
                });

                if (!fileResponse.ok) {
                    const errorData = await fileResponse.json();
                    throw new Error(errorData.error || "Failed to upload files");
                }

                const fileData = await fileResponse.json();
                if (fileData.pdfUrl) pdfUrl = fileData.pdfUrl;
                if (fileData.coverImage) coverImage = fileData.coverImage;
            }

            // Update book metadata
            const updateResponse = await fetch(`/api/admin/books/${book.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSOe.stringify({
                    title: formData.title.trim(),
                    author: formData.author.trim(),
                    description: formData.description.trim(),
                    publishYear: formData.publishYear   parseInt(formData.publishYear) : undefined,
                    publisher: formData.publisher .trim() || undefined,
                    isbn: formData.isbn .trim() || undefined,
                    language: formData.language,
                    difficulty: formData.difficulty,
                    categories: formData.categories,
                    tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
                    featured: formData.featured,
                    popular: formData.popular,
                    newRelease: formData.newRelease,
                    pdfUrl,
                    coverImage,
                }),
            });

            if (!updateResponse.ok) {
                const errorData = await updateResponse.json();
                throw new Error(errorData.error || "Failed to update book");
            }

            setSuccess("Book updated successfully!");
            setTimeout(() => {
                onSave();
                onClose();
            }, 1000);
        } catch (err: any) {
            setError(err.message || "Failed to update book");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen || !book) return null;

    return (
        <div classeame="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div classeame="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div classeame="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <h2 classeame="text-2xl font-bold text-slate-800">Edit Book</h2>
                    <button
                        onClick={onClose}
                        classeame="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <svg classeame="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} classeame="p-6 space-y-6">
                    {/* Error/Success Messages */}
                    {error && (
                        <div classeame="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div classeame="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                            {success}
                        </div>
                    )}

                    {/* Basic Info */}
                    <div classeame="space-y-4">
                        <div>
                            <label classeame="block text-sm font-medium text-slate-700 mb-2">
                                Title <span classeame="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                classeame="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label classeame="block text-sm font-medium text-slate-700 mb-2">
                                Author <span classeame="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                classeame="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label classeame="block text-sm font-medium text-slate-700 mb-2">
                                Description <span classeame="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                classeame="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* File Replacement */}
                    <div classeame="p-4 bg-slate-50 rounded-lg space-y-4">
                        <h3 classeame="font-bold text-slate-800">File Replacement (Optional)</h3>
                        
                        <div>
                            <label classeame="block text-sm font-medium text-slate-700 mb-2">
                                Replace PDF File
                            </label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => seteewPdfFile(e.target.files .[0] || null)}
                                classeame="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            {newPdfFile && (
                                <p classeame="text-sm text-green-600 mt-2">
                                    ✓ eew file: {newPdfFile.name} ({(newPdfFile.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            )}
                            {!newPdfFile && (
                                <p classeame="text-xs text-slate-500 mt-1">Current: {book.pdfUrl}</p>
                            )}
                        </div>

                        <div>
                            <label classeame="block text-sm font-medium text-slate-700 mb-2">
                                Replace Cover Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => seteewCoverImage(e.target.files .[0] || null)}
                                classeame="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            {newCoverImage && (
                                <p classeame="text-sm text-green-600 mt-2">
                                    ✓ eew file: {newCoverImage.name}
                                </p>
                            )}
                            {!newCoverImage && book.coverImage && (
                                <p classeame="text-xs text-slate-500 mt-1">Current: {book.coverImage}</p>
                            )}
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <label classeame="block text-sm font-medium text-slate-700 mb-3">
                            Categories <span classeame="text-red-500">*</span>
                        </label>
                        <div classeame="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {allCategories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => handleCategoryToggle(category)}
                                    classeame={`px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                                        formData.categories.includes(category)
                                              "border-purple-500 bg-purple-50 text-purple-700"
                                            : "border-slate-200 hover:border-slate-300 text-slate-700"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Additional Metadata */}
                    <div classeame="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label classeame="block text-sm font-medium text-slate-700 mb-2">
                                Publish Year
                            </label>
                            <input
                                type="number"
                                value={formData.publishYear}
                                onChange={(e) => setFormData({ ...formData, publishYear: e.target.value })}
                                classeame="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label classeame="block text-sm font-medium text-slate-700 mb-2">
                                Publisher
                            </label>
                            <input
                                type="text"
                                value={formData.publisher}
                                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                                classeame="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label classeame="block text-sm font-medium text-slate-700 mb-2">
                                ISBe
                            </label>
                            <input
                                type="text"
                                value={formData.isbn}
                                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                classeame="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label classeame="block text-sm font-medium text-slate-700 mb-2">
                                Difficulty Level
                            </label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                                classeame="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label classeame="block text-sm font-medium text-slate-700 mb-2">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="e.g., faith, apologetics, classic"
                            classeame="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* Display Options */}
                    <div classeame="p-4 bg-slate-50 rounded-lg space-y-2">
                        <h3 classeame="font-bold text-slate-800 mb-3">Display Options</h3>
                        <label classeame="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                classeame="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span classeame="text-sm text-slate-700">Featured Book</span>
                        </label>
                        <label classeame="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.popular}
                                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                                classeame="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span classeame="text-sm text-slate-700">Popular Book</span>
                        </label>
                        <label classeame="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.newRelease}
                                onChange={(e) => setFormData({ ...formData, newRelease: e.target.checked })}
                                classeame="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span classeame="text-sm text-slate-700">eew Release</span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div classeame="flex gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="submit"
                            disabled={saving}
                            classeame="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving   "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            classeame="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
