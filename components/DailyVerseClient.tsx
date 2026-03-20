"use client";

import { useState, useEffect } from "react";
import { FlameIcon } from "./icons";

interface StreakData {
    currentStreak: number;
    lastReadDate: string | null;
    totalReads: number;
}

export default function DailyVerseClient() {
    const [streakData, setStreakData] = useState<StreakData>({
        currentStreak: 0,
        lastReadDate: null,
        totalReads: 0,
    });
    const [hasReadToday, setHasReadToday] = useState(false);
    const [showEncouragement, setShowEncouragement] = useState(false);

    // Daily verse (would come from CMS/API in production)
    const dailyVerse = {
        text: "For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.",
        reference: "Jeremiah 29:11",
        reflection: "God has a purpose for your life. Even in uncertain times, trust that He is working all things together for your good. What area of your life do you need to surrender to His plan today?",
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };

    useEffect(() => {
        const savedData = localStorage.getItem("reawakening_streak");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setStreakData(parsed);

            const today = new Date().toDateString();
            if (parsed.lastReadDate === today) {
                setHasReadToday(true);
            } else if (parsed.lastReadDate) {
                const lastRead = new Date(parsed.lastReadDate);
                const daysDiff = Math.floor((new Date().getTime() - lastRead.getTime()) / (1000 * 60 * 60 * 24));
                if (daysDiff > 2) {
                    setStreakData({ ...parsed, currentStreak: 0 });
                }
            }
        }
    }, []);

    const markAsRead = () => {
        if (hasReadToday) return;

        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        let newStreak = streakData.currentStreak;

        if (streakData.lastReadDate === yesterday || streakData.lastReadDate === null) {
            newStreak += 1;
        } else {
            const lastRead = streakData.lastReadDate ? new Date(streakData.lastReadDate) : null;
            if (lastRead) {
                const daysDiff = Math.floor((new Date().getTime() - lastRead.getTime()) / (1000 * 60 * 60 * 24));
                newStreak = daysDiff <= 2 ? newStreak + 1 : 1;
            } else {
                newStreak = 1;
            }
        }

        const newData: StreakData = {
            currentStreak: newStreak,
            lastReadDate: today,
            totalReads: streakData.totalReads + 1,
        };

        setStreakData(newData);
        setHasReadToday(true);
        setShowEncouragement(true);
        localStorage.setItem("reawakening_streak", JSON.stringify(newData));
        setTimeout(() => setShowEncouragement(false), 4000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
            
            {/* Streak & Progress Card */}
            <div className="card-navy p-8 md:p-10 rounded-3xl relative overflow-hidden group shadow-premium">
                <div className="absolute inset-0 bg-hero-pattern opacity-100" />
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 70% 30%, rgba(212,175,55,0.12) 0%, transparent 70%)" }} />
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="text-center md:text-left">
                        <p className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-gold-500/60 mb-3">Spiritual Walk</p>
                        <h3 className="font-display text-3xl font-semibold text-cream-50 mb-6 leading-tight">Your Consistency Journey</h3>
                        
                        <div className="flex justify-center md:justify-start gap-12">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <FlameIcon className="text-gold-400" size={20} />
                                    <span className="font-display text-4xl font-bold text-gold-gradient">{streakData.currentStreak}</span>
                                </div>
                                <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-navy-400">Day Streak</p>
                            </div>
                            <div className="border-l border-navy-800/80 pl-12">
                                <span className="font-display text-4xl font-bold text-cream-50">{streakData.totalReads}</span>
                                <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-navy-400 mt-1">Total Reads</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-navy-900/40 backdrop-blur-sm border border-navy-800 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <p className="font-sans text-xs text-navy-300 leading-relaxed italic">
                                &ldquo;This streak is a tool for consistency, not a measure of worth. Grace is new every morning, regardless of the numbers.&rdquo;
                            </p>
                        </div>
                        <div className="mt-5 pt-4 border-t border-navy-800 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gold-500/60 tracking-widest uppercase">1 Day grace period active</span>
                            <div className="flex gap-1">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= (streakData.currentStreak % 5 || (streakData.currentStreak > 0 ? 5 : 0)) ? 'bg-gold-500 shadow-glow-gold' : 'bg-navy-800'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Verse Component */}
            <div className="bg-white rounded-[2rem] border border-cream-200 overflow-hidden shadow-card">
                <div className="p-10 md:p-14 text-center">
                    <div className="inline-flex items-center gap-3 mb-10">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold-400" />
                        <span className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-gold-600">{dailyVerse.date}</span>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold-400" />
                    </div>

                    <h2 className="font-display italic text-3xl md:text-4xl lg:text-5xl text-navy-950 leading-[1.3] mb-8 font-light max-w-3xl mx-auto">
                        &ldquo;{dailyVerse.text}&rdquo;
                    </h2>
                    
                    <p className="font-sans text-sm font-bold tracking-[0.2em] text-gold-600 uppercase mb-12">
                        {dailyVerse.reference}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start text-left pt-10 border-t border-cream-100">
                        <div className="md:col-span-4">
                            <h4 className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-navy-400 mb-4">Daily Reflection</h4>
                            <div className="gold-line w-8" />
                        </div>
                        <div className="md:col-span-8">
                            <p className="font-sans text-base text-ink-600 leading-relaxed">
                                {dailyVerse.reflection}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-cream-50/50 p-8 md:p-10 border-t border-cream-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="font-sans text-xs text-ink-400 max-w-xs text-center md:text-left">
                        Spend a few minutes in prayer reflecting on today&apos;s word before marking as complete.
                    </p>
                    
                    <button
                        onClick={markAsRead}
                        disabled={hasReadToday}
                        className={`min-w-[240px] py-4 px-10 rounded-2xl font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-sm flex items-center justify-center gap-3 ${
                            hasReadToday
                                ? "bg-white border border-gold-300 text-gold-600 cursor-not-allowed"
                                : "btn-primary hover:shadow-glow-gold active:scale-95"
                        }`}
                    >
                        {hasReadToday ? (
                            <>
                                <svg className="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Journey Recorded
                            </>
                        ) : (
                            <>
                                Mark as Read
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Encouragement Notification */}
            {showEncouragement && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
                    <div className="bg-navy-950 border border-gold-500/30 text-cream-50 px-8 py-5 rounded-3xl shadow-premium backdrop-blur-xl flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-gold-400 flex items-center justify-center shadow-glow-gold animate-bounce">
                           <FlameIcon className="text-navy-950" size={24} />
                        </div>
                        <div>
                            <p className="font-display text-xl font-semibold leading-none text-gold-400 mb-1">Fire Ignited!</p>
                            <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-navy-400">Great work on today&apos;s devotion</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
