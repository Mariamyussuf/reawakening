import Link from "next/link";

import { getArchivedConferences, getArchiveOverview } from "@/lib/archive";

export const dynamic = "force-dynamic";

export default async function AdminArchivePage() {
    const [archivedConferences, archiveOverview] = await Promise.all([
        getArchivedConferences(),
        getArchiveOverview(),
    ]);

    return (
        <div className="min-h-screen bg-cream font-body">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <p className="eyebrow mb-1">Past Records</p>
                        <h1 className="font-display text-3xl text-deep">Past archive</h1>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link href="/archive" className="btn-outline">
                            Open Public Archive
                        </Link>
                        <Link href="/admin" className="btn-primary">
                            Back to Admin
                        </Link>
                    </div>
                </div>

                <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div className="max-w-2xl">
                            <p className="text-xs text-deep/50 tracking-wide uppercase mb-2">Archive Operations</p>
                            <h2 className="font-display text-2xl sm:text-4xl text-deep mb-3">
                                Real archived conference records, ready for review
                            </h2>
                            <p className="text-deep/70 leading-relaxed">
                                This section now reads from live archived conference data so the leadership team can review past themes, summaries, and notes without placeholder content.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-deep p-5 min-w-[220px]">
                            <p className="text-[10px] tracking-[0.2em] uppercase text-gold/70 mb-2">Latest Archive Update</p>
                            <p className="font-display text-xl text-cream">
                                {archiveOverview.latestArchivedAt
                                    ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(archiveOverview.latestArchivedAt))
                                    : "No archive yet"}
                            </p>
                            <p className="text-sm text-cream/60 mt-1">
                                {archiveOverview.archivedConferences} archived conference records
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    {[
                        ["Archived Conferences", `${archiveOverview.archivedConferences}`, "Conference records marked archived"],
                        ["Published Devotionals", `${archiveOverview.publishedDevotionals}`, "Live devotional resources supporting past themes"],
                        ["Books Library", `${archiveOverview.totalBooks}`, "Current library resources tied to ministry learning"],
                        ["Public View", archivedConferences.length > 0 ? "Live" : "Waiting", "The archive page reflects these records automatically"],
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

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <section className="bg-warm-white border border-mid/20 rounded-3xl p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                            <div>
                                <p className="eyebrow mb-2">Archived Conferences</p>
                                <h2 className="font-display text-2xl text-deep">Saved ministry seasons</h2>
                            </div>

                            <Link href="/admin/conferences" className="btn-outline">
                                Manage Conferences
                            </Link>
                        </div>

                        {archivedConferences.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-mid/30 bg-cream px-6 py-16 text-center">
                                <p className="eyebrow mb-3">No Archive Records Yet</p>
                                <h3 className="font-display text-2xl text-deep mb-2">Archive entries appear when conferences are marked archived</h3>
                                <p className="text-deep/65 leading-relaxed">
                                    Use the conference manager to move completed events into the archive, and they will show up here and on the public archive page.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {archivedConferences.map((conference) => (
                                    <article key={conference.id} className="rounded-2xl border border-mid/20 bg-cream p-5">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.18em] text-gold-dark mb-2">{conference.dateLabel}</p>
                                                    <h3 className="font-display text-2xl text-deep mb-2">{conference.theme}</h3>
                                                    <p className="text-deep/70 leading-relaxed">{conference.summary}</p>
                                                </div>
                                                <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] bg-deep text-cream">
                                                    Archived
                                                </span>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-3 text-sm">
                                                <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-3 text-deep/70">
                                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-1">Venue</span>
                                                    {conference.venue}
                                                </div>
                                                <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-3 text-deep/70">
                                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-1">Time</span>
                                                    {conference.timeLabel}
                                                </div>
                                                <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-3 text-deep/70">
                                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-1">Format</span>
                                                    {conference.isOnline ? "Online" : "In person"}
                                                </div>
                                            </div>

                                            <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-4 text-deep/70">
                                                <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-2">Archive Notes</span>
                                                {conference.details || "No additional archive notes were added for this conference yet."}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="space-y-6">
                        <div className="bg-deep rounded-3xl p-6 border border-gold/20 shadow-sm">
                            <p className="eyebrow mb-3 text-gold/80">Public Sync</p>
                            <h3 className="font-display text-2xl text-cream mb-3">Archive records now flow to the public site</h3>
                            <p className="text-sm text-cream/70 leading-relaxed mb-5">
                                There is no separate placeholder archive anymore. The public archive now reads from these archived conference records.
                            </p>
                            <Link href="/archive" className="btn-primary inline-block">
                                Review Public Archive
                            </Link>
                        </div>

                        <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 shadow-sm">
                            <p className="eyebrow mb-3">Next Step</p>
                            <h3 className="font-display text-2xl text-deep mb-3">Keep archive data healthy</h3>
                            <p className="text-sm text-deep/70 leading-relaxed">
                                When a conference season ends, move it to archived status from the conference module and add clear notes so future planning has real context to work from.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
