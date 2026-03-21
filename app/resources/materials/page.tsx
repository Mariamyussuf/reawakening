import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Materials | Reawakening Resources",
    description: "Access devotionals, prayer guides, study outlines, and holiday reset plans.",
};

export default function MaterialsPage() {
    const materials = [
        {
            id: 1,
            title: "30-Day Holiday Reset",
            category: "Devotional",
            description: "A daily devotional guide to help you stay spiritually grounded during the holiday season.",
            duration: "30 days",
            format: "PDF",
        },
        {
            id: 2,
            title: "Prayer Guide for Students",
            category: "Prayer Guide",
            description: "Structured prayer points covering academics, relationships, spiritual growth, and future direction.",
            duration: "Ongoing",
            format: "PDF",
        },
        {
            id: 3,
            title: "Book of Romans Study Outline",
            category: "Study Guide",
            description: "Chapter-by-chapter study guide through Paul's letter to the Romans with reflection questions.",
            duration: "16 sessions",
            format: "PDF",
        },
        {
            id: 4,
            title: "Spiritual Disciplines Starter Pack",
            category: "Practical Guide",
            description: "Introduction to key spiritual disciplines: prayer, fasting, Scripture reading, and journaling.",
            duration: "Self-paced",
            format: "PDF",
        },
    ];

    return (
        <>
            <Header />
            <main className="min-h-screen">
                {/* Hero */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
                    <div className="container-custom text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Materials</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Devotionals, prayer guides, and study resources for your spiritual journey
                        </p>
                    </div>
                </section>

                {/* Materials Grid */}
                <section className="container-custom py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {materials.map((material) => (
                            <div key={material.id} className="card hover:shadow-xl transition-all duration-300">
                                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                                    {material.category}
                                </span>
                                <h2 className="text-2xl font-bold text-slate-800 mb-3">{material.title}</h2>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    {material.description}
                                </p>
                                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                                    <span>Duration: {material.duration}</span>
                                    <span>Format: {material.format}</span>
                                </div>
                                <button className="btn-primary w-full">
                                    Download Material
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
