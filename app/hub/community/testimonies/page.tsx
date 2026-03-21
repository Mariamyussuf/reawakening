"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readStoredItems, writeStoredItems } from "@/lib/community-storage";

const STORAGE_KEY = "community-testimonies";

interface Testimony {
    id: string;
    name: string;
    title: string;
    story: string;
}

const defaultTestimonies: Testimony[] = [
    {
        id: "ada",
        name: "Ada",
        title: "I found consistency in prayer again",
        story: "Reawakening helped me move from scattered devotion to a steady prayer life. The daily rhythm and Scripture focus gave me structure and joy again.",
    },
    {
        id: "daniel",
        name: "Daniel",
        title: "Bible study stopped feeling overwhelming",
        story: "I used to avoid long Bible reading sessions because I did not know where to start. The reading tools and community encouragement made it feel possible.",
    },
    {
        id: "esther",
        name: "Esther",
        title: "I became bolder about sharing my faith",
        story: "Through the devotionals and prayer spaces, I grew in confidence and started speaking openly about what God has been doing in my life.",
    },
];

export default function CommunityTestimoniesPage() {
    const [testimonies, setTestimonies] = useState<Testimony[]>(defaultTestimonies);
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [story, setStory] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const saved = readStoredItems<Testimony>(STORAGE_KEY);
        if (saved.length > 0) {
            setTestimonies([...saved, ...defaultTestimonies]);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !title.trim() || !story.trim()) {
            setStatus("Please fill in your name, title, and testimony.");
            return;
        }

        const newTestimony: Testimony = {
            id: `custom-${Date.now()}`,
            name: name.trim(),
            title: title.trim(),
            story: story.trim(),
        };

        const customOnly = testimonies.filter((item) => item.id.startsWith("custom-"));
        const nextCustom = [newTestimony, ...customOnly];
        writeStoredItems(STORAGE_KEY, nextCustom);
        setTestimonies([newTestimony, ...testimonies]);
        setName("");
        setTitle("");
        setStory("");
        setStatus("Testimony saved on this device.");
    };

    return (
        <div className="page-shell">
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                <div className="container-custom py-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link href="/hub/community" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-medium">Back to Community</span>
                    </Link>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Testimonies</h1>
                    <div className="hidden sm:block w-28" />
                </div>
            </header>

            <main className="container-custom py-8 space-y-6">
                {status && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {status}
                    </div>
                )}

                <div className="card-accent-soft">
                    <h2 className="text-3xl font-bold mb-3">Stories of growth, grace, and renewed fire</h2>
                    <p className="text-slate-700">
                        Read what God is doing in the community and share your own testimony below.
                    </p>
                </div>

                <div className="card">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Share Your Testimony</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                className="input-soft"
                            />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Short title for your testimony"
                                className="input-soft"
                            />
                        </div>
                        <textarea
                            rows={5}
                            value={story}
                            onChange={(e) => setStory(e.target.value)}
                            placeholder="What has God been teaching or doing in your life?"
                            className="input-soft"
                        />
                        <button
                            type="submit"
                            className="btn-soft-primary"
                        >
                            Save Testimony
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {testimonies.map((testimony) => (
                        <div key={testimony.id} className="card-soft">
                            <p className="text-sm font-semibold text-gold-dark mb-3">{testimony.name}</p>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">{testimony.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{testimony.story}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
