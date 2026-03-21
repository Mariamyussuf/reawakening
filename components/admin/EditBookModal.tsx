"use client";

import { useEffect, useState } from "react";
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
        difficulty: "beginner" as Book["difficulty"],
        categories: [] as BookCategory[],
        tags: "",
        featured: false,
        popular: false,
        newRelease: false,
    });
    const [newPdfFile, setNewPdfFile] = useState<File | null>(null);
    const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!book || !isOpen) {
            return;
        }

        setFormData({
            title: book.title || "",
            author: book.author || "",
            description: book.description || "",
            publishYear: book.publishYear?.toString() || "",
            publisher: book.publisher || "",
            isbn: book.isbn || "",
            language: book.language || "en",
            difficulty: book.difficulty || "beginner",
            categories: book.categories || [],
            tags: (book.tags || []).join(", "),
            featured: book.featured || false,
            popular: book.popular || false,
            newRelease: book.newRelease || false,
        });
        setNewPdfFile(null);
        setNewCoverImage(null);
        setError("");
        setSuccess("");
    }, [book, isOpen]);

    const handleCategoryToggle = (category: BookCategory) => {
        setFormData((prev) => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter((item) => item !== category)
                : [...prev.categories, category],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!book) return;

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            let pdfUrl = book.pdfUrl;
            let coverImage = book.coverImage;

            if (newPdfFile || newCoverImage) {
                const uploadData = new FormData();
                if (newPdfFile) uploadData.append("pdf", newPdfFile);
                if (newCoverImage) uploadData.append("cover", newCoverImage);
                uploadData.append("bookId", book.id);
                uploadData.append("replace", "true");

                const uploadResponse = await fetch("/api/admin/books/upload/replace", {
                    method: "POST",
                    body: uploadData,
                });
                const uploadPayload = await uploadResponse.json().catch(() => null);
                if (!uploadResponse.ok) {
                    throw new Error(uploadPayload?.error || "Failed to upload files");
                }
                pdfUrl = uploadPayload?.pdfUrl || pdfUrl;
                coverImage = uploadPayload?.coverImage || coverImage;
            }

            const response = await fetch(`/api/admin/books/${book.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title.trim(),
                    author: formData.author.trim(),
                    description: formData.description.trim(),
                    publishYear: formData.publishYear ? parseInt(formData.publishYear, 10) : undefined,
                    publisher: formData.publisher.trim() || undefined,
                    isbn: formData.isbn.trim() || undefined,
                    language: formData.language,
                    difficulty: formData.difficulty,
                    categories: formData.categories,
                    tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
                    featured: formData.featured,
                    popular: formData.popular,
                    newRelease: formData.newRelease,
                    pdfUrl,
                    coverImage,
                }),
            });
            const payload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(payload?.error || "Failed to update book");
            }

            setSuccess("Book updated successfully.");
            setTimeout(() => {
                onSave();
                onClose();
            }, 800);
        } catch (err: any) {
            setError(err.message || "Failed to update book");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen || !book) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">Edit Book</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
                    {success && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="w-full px-4 py-3 border border-slate-300 rounded-lg" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Title" required />
                        <input className="w-full px-4 py-3 border border-slate-300 rounded-lg" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} placeholder="Author" required />
                    </div>

                    <textarea className="w-full px-4 py-3 border border-slate-300 rounded-lg" rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" required />

                    <div className="p-4 bg-slate-50 rounded-lg space-y-4">
                        <h3 className="font-bold text-slate-800">File Replacement</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Replace PDF File</label>
                            <input type="file" accept=".pdf" onChange={(e) => setNewPdfFile(e.target.files?.[0] || null)} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                            {newPdfFile && <p className="text-sm text-green-600 mt-2">Selected file: {newPdfFile.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Replace Cover Image</label>
                            <input type="file" accept="image/*" onChange={(e) => setNewCoverImage(e.target.files?.[0] || null)} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                            {newCoverImage && <p className="text-sm text-green-600 mt-2">Selected file: {newCoverImage.name}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">Categories</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {Object.values(BookCategory).map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => handleCategoryToggle(category)}
                                    className={`px-3 py-2 rounded-lg border-2 text-sm font-medium ${
                                        formData.categories.includes(category)
                                            ? "border-purple-500 bg-purple-50 text-purple-700"
                                            : "border-slate-200 text-slate-700"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="w-full px-4 py-3 border border-slate-300 rounded-lg" type="number" value={formData.publishYear} onChange={(e) => setFormData({ ...formData, publishYear: e.target.value })} placeholder="Publish Year" />
                        <input className="w-full px-4 py-3 border border-slate-300 rounded-lg" value={formData.publisher} onChange={(e) => setFormData({ ...formData, publisher: e.target.value })} placeholder="Publisher" />
                        <input className="w-full px-4 py-3 border border-slate-300 rounded-lg" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} placeholder="ISBN" />
                        <select className="w-full px-4 py-3 border border-slate-300 rounded-lg" value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Book["difficulty"] })}>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <input className="w-full px-4 py-3 border border-slate-300 rounded-lg" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="Tags separated by commas" />

                    <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
                            <span>Featured Book</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={formData.popular} onChange={(e) => setFormData({ ...formData, popular: e.target.checked })} />
                            <span>Popular Book</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={formData.newRelease} onChange={(e) => setFormData({ ...formData, newRelease: e.target.checked })} />
                            <span>New Release</span>
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <button type="submit" disabled={saving} className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50">
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
