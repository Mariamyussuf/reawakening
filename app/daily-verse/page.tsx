import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DailyVerseClient from "@/components/DailyVerseClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Daily Bible Verse | Reawakening Ministry",
    description: "Start your day with Scripture. Build consistency with daily Bible verses and gentle streak tracking.",
};

export default function DailyVersePage() {
    return (
        <>
            <Header />
            <main className="min-h-screen">
                {/* Hero */}
                <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-20">
                    <div className="container-custom text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Daily Bible Verse</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Build consistency in God&apos;s Word, one day at a time
                        </p>
                    </div>
                </section>

                {/* Main Content */}
                <section className="container-custom py-16">
                    <div className="max-w-3xl mx-auto">
                        <DailyVerseClient />
                    </div>
                </section>

                {/* How It Works */}
                <section className="bg-white/50 backdrop-blur-sm py-16">
                    <div className="container-custom">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="section-title text-center mb-12">How It Works</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="card text-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                                        1
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-2">Read Daily</h3>
                                    <p className="text-slate-600 text-sm">
                                        Each day, a new Bible verse is shared with a reflection prompt
                                    </p>
                                </div>

                                <div className="card text-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                                        2
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-2">Mark as Read</h3>
                                    <p className="text-slate-600 text-sm">
                                        After reading and reflecting, mark the verse as read to track your journey
                                    </p>
                                </div>

                                <div className="card text-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                                        3
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-2">Build Consistency</h3>
                                    <p className="text-slate-600 text-sm">
                                        Your streak grows as you engage daily, with grace for missed days
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="container-custom py-16">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="section-title text-center mb-12">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="card">
                                <h3 className="font-bold text-slate-800 mb-2">What happens if I miss a day?</h3>
                                <p className="text-slate-600">
                                    You have a 1-day grace period. If you miss one day, your streak won&apos;t reset immediately. This feature is designed to encourage consistency without creating unnecessary pressure.
                                </p>
                            </div>

                            <div className="card">
                                <h3 className="font-bold text-slate-800 mb-2">Can others see my streak?</h3>
                                <p className="text-slate-600">
                                    No. Your streak is private and stored locally on your device. This is about your personal growth, not comparison with others.
                                </p>
                            </div>

                            <div className="card">
                                <h3 className="font-bold text-slate-800 mb-2">Do I need to create an account?</h3>
                                <p className="text-slate-600">
                                    Not currently. Your progress is saved in your browser. In the future, we may add optional accounts for syncing across devices.
                                </p>
                            </div>

                            <div className="card">
                                <h3 className="font-bold text-slate-800 mb-2">What if I lose my streak?</h3>
                                <p className="text-slate-600">
                                    Remember: God&apos;s grace isn&apos;t measured in streaks. If you lose your streak, simply start again. Every day is a new opportunity to grow in faith.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
