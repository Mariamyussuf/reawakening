import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import type { Metadata } from "next";

import { getArchivedConferences, getArchiveOverview } from "@/lib/archive";

export const metadata: Metadata = {
    title: "Archive | Reawakening Ministry",
    description: "Explore past Reawakening conferences, teachings, and materials from previous editions.",
};

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
    const [archivedConferences, archiveOverview] = await Promise.all([
        getArchivedConferences(),
        getArchiveOverview(),
    ]);

    return (
        <>
            <Header />
            <main className="min-h-screen font-body">
                <section className="relative bg-deep py-20 md:py-28 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-radial-gold opacity-20" />
                    <div className="noise-overlay" />

                    <div className="container-page relative z-10 text-center">
                        <p className="eyebrow mb-4">Ministry Memory</p>
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream mb-6">
                            Past <span className="italic text-gold">Archive</span>
                        </h1>
                        <p className="font-display italic text-xl md:text-2xl text-cream/70 max-w-2xl mx-auto">
                            Real conference records, preserved from archived ministry seasons
                        </p>
                    </div>
                </section>

                <section className="bg-cream py-16 md:py-20">
                    <div className="container-page">
                        <div className="max-w-3xl mx-auto text-center">
                            <p className="text-lg text-deep/70 leading-relaxed">
                                Every archived conference here is pulled from the live ministry records. This page now reflects real conference themes, timing, and notes instead of static sample entries.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-5xl mx-auto">
                            {[
                                ["Archived Conferences", `${archiveOverview.archivedConferences}`, "Conference records currently marked archived"],
                                ["Published Devotionals", `${archiveOverview.publishedDevotionals}`, "Supporting devotional content available on the platform"],
                                ["Library Resources", `${archiveOverview.totalBooks}`, "Books members can still revisit alongside past themes"],
                            ].map(([label, value, detail], index) => (
                                <div
                                    key={label}
                                    className={`rounded-2xl border p-5 shadow-sm ${
                                        index === 1
                                            ? "bg-deep border-deep text-cream"
                                            : index === 2
                                                ? "bg-gold/15 border-gold/30 text-deep"
                                                : "bg-warm-white border-mid/20 text-deep"
                                    }`}
                                >
                                    <p className={`text-xs tracking-wide uppercase mb-2 ${index === 1 ? "text-gold/75" : "text-deep/50"}`}>{label}</p>
                                    <p className="font-display text-3xl mb-2">{value}</p>
                                    <p className={`text-sm leading-relaxed ${index === 1 ? "text-cream/70" : "text-deep/70"}`}>{detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-warm-white py-16 md:py-20">
                    <div className="container-page">
                        <div className="max-w-5xl mx-auto space-y-6">
                            {archivedConferences.length === 0 ? (
                                <div className="bg-cream border border-mid/20 rounded-3xl p-10 text-center shadow-sm">
                                    <p className="eyebrow mb-3">Nothing Archived Yet</p>
                                    <h2 className="font-display text-3xl text-deep mb-3">Archived conferences will appear here automatically</h2>
                                    <p className="text-deep/70 leading-relaxed mb-6">
                                        Once a conference is marked as archived in the admin workspace, this page will update with the real record.
                                    </p>
                                    <Link href="/conference" className="btn-primary inline-block">
                                        View Upcoming Conference
                                    </Link>
                                </div>
                            ) : (
                                archivedConferences.map((conference) => (
                                    <article key={conference.id} className="bg-cream border border-mid/20 rounded-3xl p-6 md:p-8 shadow-sm">
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                                            <div>
                                                <span className="inline-flex items-center rounded-full bg-gold/15 border border-gold/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark mb-4">
                                                    {conference.dateLabel}
                                                </span>
                                                <h2 className="font-display text-3xl md:text-4xl text-deep mb-3">{conference.theme}</h2>
                                                <p className="text-deep/70 leading-relaxed max-w-3xl">{conference.summary}</p>
                                            </div>

                                            <div className="rounded-2xl bg-warm-white border border-mid/20 px-5 py-4 min-w-[220px]">
                                                <p className="text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">Archive Status</p>
                                                <p className="font-display text-2xl text-deep mb-1">Archived</p>
                                                <p className="text-sm text-deep/60">
                                                    Updated {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(conference.updatedAt))}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
                                            <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-4">
                                                <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-2">Venue</span>
                                                <p className="text-deep/80">{conference.venue}</p>
                                            </div>
                                            <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-4">
                                                <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-2">Time</span>
                                                <p className="text-deep/80">{conference.timeLabel}</p>
                                            </div>
                                            <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-4">
                                                <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-2">Format</span>
                                                <p className="text-deep/80">{conference.isOnline ? "Online gathering" : "In-person gathering"}</p>
                                            </div>
                                            <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-4">
                                                <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-2">Cost</span>
                                                <p className="text-deep/80">{conference.costLabel}</p>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl bg-warm-white border border-mid/20 px-5 py-5">
                                            <p className="text-xs uppercase tracking-[0.18em] text-deep/45 mb-3">Archive Notes</p>
                                            <p className="text-deep/70 leading-relaxed">
                                                {conference.details || "This archived conference is now preserved through its live conference summary and event details."}
                                            </p>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                <section className="bg-cream py-16 md:py-20">
                    <div className="container-page">
                        <div className="max-w-3xl mx-auto text-center">
                            <p className="eyebrow mb-3">A Spiritual Legacy</p>
                            <h2 className="font-display text-3xl md:text-4xl text-deep mb-6">
                                God has been faithful in every <span className="italic text-gold">season</span>
                            </h2>
                            <p className="text-lg text-deep/70 leading-relaxed mb-4">
                                Archived records help the ministry remember what God has done, learn from previous themes, and prepare wisely for what comes next.
                            </p>
                            <p className="text-deep/60 leading-relaxed">
                                {archiveOverview.latestArchivedAt
                                    ? `Latest archive update: ${new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(archiveOverview.latestArchivedAt))}.`
                                    : "New archived conference records will appear here as the ministry history grows."}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-warm-white py-16 md:py-20">
                    <div className="container-page">
                        <div className="bg-deep rounded-3xl border border-gold/20 p-10 md:p-12 text-center shadow-premium">
                            <p className="eyebrow mb-3 text-gold/80">Next Chapter</p>
                            <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">Be part of the next gathering</h2>
                            <p className="text-cream/70 text-lg mb-6 max-w-2xl mx-auto">
                                The archive remembers where the ministry has been. The upcoming conference shows where God is leading next.
                            </p>
                            <Link href="/conference" className="btn-primary inline-block">
                                View Upcoming Conference
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
