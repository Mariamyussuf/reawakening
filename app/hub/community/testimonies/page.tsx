"use client";

import Link from "next/link";

const testimonies = [
    {
        name: "Ada",
        title: "I found consistency in prayer again",
        story: "Reawakening helped me move from scattered devotion to a steady prayer life. The daily rhythm and Scripture focus gave me structure and joy again.",
    },
    {
        name: "Daniel",
        title: "Bible study stopped feeling overwhelming",
        story: "I used to avoid long Bible reading sessions because I did not know where to start. The reading tools and community encouragement made it feel possible.",
    },
    {
        name: "Esther",
        title: "I became bolder about sharing my faith",
        story: "Through the devotionals and prayer spaces, I grew in confidence and started speaking openly about what God has been doing in my life.",
    },
];

export default function CommunityTestimoniesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                <div className="container-custom py-4 flex items-center justify-between gap-4">
                    <Link href="/hub/community" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-medium">Back to Community</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">Testimonies</h1>
                    <div className="w-28" />
                </div>
            </header>

            <main className="container-custom py-8 space-y-6">
                <div className="card bg-gradient-to-r from-orange-600 to-amber-600 text-white">
                    <h2 className="text-3xl font-bold mb-3">Stories of growth, grace, and renewed fire</h2>
                    <p className="text-orange-100">
                        These testimonies reflect the kind of spiritual fruit we want this community to keep nurturing.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {testimonies.map((testimony) => (
                        <div key={testimony.title} className="card">
                            <p className="text-sm font-semibold text-orange-600 mb-3">{testimony.name}</p>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">{testimony.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{testimony.story}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
