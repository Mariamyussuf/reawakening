import Link from "next/link";

import {
    DAILY_VERSE_ROTATION,
    getDailyVerseDateLabel,
    getDailyVerseRotationItem,
    getUpcomingDailyVerseSchedule,
} from "@/lib/daily-verses";
import { getVerseOfTheDay, isBibleApiConfigured } from "@/lib/server/bible-api";

export const dynamic = "force-dynamic";

export default async function AdminVersesPage() {
    const todayRotation = getDailyVerseRotationItem();
    const upcomingSchedule = getUpcomingDailyVerseSchedule(7);
    const apiConfigured = isBibleApiConfigured();

    let currentVerse = null;
    let loadError = "";

    if (apiConfigured) {
        try {
            currentVerse = await getVerseOfTheDay();
        } catch (error: any) {
            loadError = error?.message || "Unable to load today's verse.";
        }
    } else {
        loadError = "BIBLE_API_KEY is not configured for live verse text yet.";
    }

    return (
        <div className="min-h-screen bg-cream font-body">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <p className="eyebrow mb-1">Scripture Flow</p>
                        <h1 className="font-display text-3xl text-deep">Daily verses</h1>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link href="/daily-verse" className="btn-outline">
                            Open Public Page
                        </Link>
                        <Link href="/admin" className="btn-primary">
                            Back to Admin
                        </Link>
                    </div>
                </div>

                <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div className="max-w-2xl">
                            <p className="text-xs text-deep/50 tracking-wide uppercase mb-2">Verse Rotation</p>
                            <h2 className="font-display text-2xl sm:text-4xl text-deep mb-3">
                                Live scripture rotation for the daily verse experience
                            </h2>
                            <p className="text-deep/70 leading-relaxed">
                                This module now reflects the actual verse-of-the-day rotation, the live Bible API response for today, and the upcoming schedule the public page will follow.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-deep p-5 min-w-[220px]">
                            <p className="text-[10px] tracking-[0.2em] uppercase text-gold/70 mb-2">Today&apos;s Reference</p>
                            <p className="font-display text-xl text-cream">{todayRotation.referenceLabel}</p>
                            <p className="text-sm text-cream/60 mt-1">{getDailyVerseDateLabel()}</p>
                        </div>
                    </div>
                </div>

                {loadError && (
                    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800">
                        {loadError}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    {[
                        ["Rotation Length", `${DAILY_VERSE_ROTATION.length}`, "Curated passages in the current loop"],
                        ["API Status", apiConfigured ? "Configured" : "Missing Key", "Live verse text depends on the Bible API key"],
                        ["Today&apos;s Focus", todayRotation.referenceLabel, todayRotation.focus],
                        ["Next Up", upcomingSchedule[1]?.referenceLabel || "Tomorrow", "What the public page will rotate to next"],
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

                <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <section className="bg-warm-white border border-mid/20 rounded-3xl p-6 shadow-sm">
                        <div className="mb-6">
                            <p className="eyebrow mb-2">Today&apos;s Verse</p>
                            <h2 className="font-display text-2xl text-deep">Current public reading</h2>
                        </div>

                        <div className="rounded-3xl border border-mid/20 bg-cream p-6 sm:p-8">
                            <p className="text-xs uppercase tracking-[0.18em] text-gold-dark mb-4">{getDailyVerseDateLabel()}</p>
                            {currentVerse ? (
                                <>
                                    <h3 className="font-display italic text-3xl text-deep leading-relaxed mb-6">
                                        &ldquo;{currentVerse.text}&rdquo;
                                    </h3>
                                    <p className="text-sm uppercase tracking-[0.2em] text-deep/50 mb-8">{currentVerse.reference}</p>
                                </>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-mid/30 bg-warm-white px-5 py-8 mb-8">
                                    <p className="font-display text-2xl text-deep mb-2">Live text unavailable</p>
                                    <p className="text-deep/70 leading-relaxed">
                                        The verse rotation is still ready, but the live Bible API response could not be loaded for this request.
                                    </p>
                                </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-4">
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-2">Focus</span>
                                    <p className="text-deep/80">{todayRotation.focus}</p>
                                </div>
                                <div className="rounded-2xl bg-warm-white border border-mid/15 px-4 py-4">
                                    <span className="block text-xs uppercase tracking-[0.18em] text-deep/40 mb-2">Reflection Prompt</span>
                                    <p className="text-deep/80">{todayRotation.reflectionPrompt}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-warm-white border border-mid/20 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div>
                                <p className="eyebrow mb-2">Schedule Preview</p>
                                <h2 className="font-display text-2xl text-deep">Upcoming rotation</h2>
                            </div>

                            <Link href="/hub/bible" className="btn-outline">
                                Bible Hub
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {upcomingSchedule.map((item) => (
                                <div
                                    key={`${item.date}-${item.verseId}`}
                                    className={`rounded-2xl border p-5 ${
                                        item.dayOffset === 0
                                            ? "border-gold/35 bg-gold/10"
                                            : "border-mid/20 bg-cream"
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">
                                                {item.dayOffset === 0 ? "Today" : item.dayOffset === 1 ? "Tomorrow" : item.dateLabel}
                                            </p>
                                            <h3 className="font-display text-2xl text-deep mb-2">{item.referenceLabel}</h3>
                                            <p className="text-deep/70 mb-3">{item.focus}</p>
                                            <p className="text-sm text-deep/55 leading-relaxed">{item.reflectionPrompt}</p>
                                        </div>
                                        <span className="inline-flex items-center rounded-full bg-warm-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-deep border border-mid/20">
                                            {item.verseId}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
