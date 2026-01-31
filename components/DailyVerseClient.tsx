"use client";

import { useState, useEffect } from "react";

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
        date: new Date().toLocaleDateString(),
    };

    useEffect(() => {
        // Load streak data from localStorage
        const savedData = localStorage.getItem("reawakening_streak");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setStreakData(parsed);

            // Check if already read today
            const today = new Date().toDateString();
            if (parsed.lastReadDate === today) {
                setHasReadToday(true);
            } else {
                // Check if streak should be reset (more than 2 days gap - 1 day grace period)
                if (parsed.lastReadDate) {
                    const lastRead = new Date(parsed.lastReadDate);
                    const daysDiff = Math.floor((new Date().getTime() - lastRead.getTime()) / (1000 * 60 * 60 * 24));

                    if (daysDiff > 2) {
                        // Reset streak
                        setStreakData({
                            ...parsed,
                            currentStreak: 0,
                        });
                    }
                }
            }
        }
    }, []);

    const markAsRead = () => {
        if (hasReadToday) return;

        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        let newStreak = streakData.currentStreak;

        // Increment streak if last read was yesterday or today is first read
        if (streakData.lastReadDate === yesterday || streakData.lastReadDate === null) {
            newStreak += 1;
        } else {
            // Check grace period (2 days)
            const lastRead = streakData.lastReadDate ? new Date(streakData.lastReadDate) : null;
            if (lastRead) {
                const daysDiff = Math.floor((new Date().getTime() - lastRead.getTime()) / (1000 * 60 * 60 * 24));
                if (daysDiff <= 2) {
                    newStreak += 1;
                } else {
                    newStreak = 1; // Reset to 1
                }
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

        // Hide encouragement after 3 seconds
        setTimeout(() => setShowEncouragement(false), 3000);
    };

    return (
        <div className="space-y-8">
            {/* Streak Display */}
            <div className="card bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
                <div className="text-center">
                    <h3 className="text-lg font-medium text-slate-700 mb-4">Your Journey</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-1">
                                {streakData.currentStreak}
                            </div>
                            <div className="text-sm text-slate-600">Day Streak</div>
                            <p className="text-xs text-slate-500 mt-2">
                                {streakData.currentStreak === 0 && "Start your journey today!"}
                                {streakData.currentStreak === 1 && "Great start! Keep going!"}
                                {streakData.currentStreak >= 2 && streakData.currentStreak < 7 && "Building consistency!"}
                                {streakData.currentStreak >= 7 && streakData.currentStreak < 30 && "Wonderful progress!"}
                                {streakData.currentStreak >= 30 && "Amazing dedication!"}
                            </p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-600 mb-1">
                                {streakData.totalReads}
                            </div>
                            <div className="text-sm text-slate-600">Total Reads</div>
                            <p className="text-xs text-slate-500 mt-2">
                                Every step counts
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Grace Period:</strong> You have 1 day of grace if you miss a day. Your streak won&apos;t reset immediately.
                        </p>
                    </div>
                </div>
            </div>

            {/* Daily Verse */}
            <div className="card">
                <div className="text-center mb-6">
                    <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        {dailyVerse.date}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif text-slate-800 leading-relaxed mb-4">
                        &quot;{dailyVerse.text}&quot;
                    </h2>
                    <p className="text-lg font-medium text-blue-600">{dailyVerse.reference}</p>
                </div>

                <div className="border-t border-slate-200 pt-6">
                    <h3 className="font-bold text-slate-800 mb-3">Reflection</h3>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        {dailyVerse.reflection}
                    </p>

                    <button
                        onClick={markAsRead}
                        disabled={hasReadToday}
                        className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${hasReadToday
                                ? "bg-green-100 text-green-700 cursor-not-allowed"
                                : "btn-primary"
                            }`}
                    >
                        {hasReadToday ? (
                            <span className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Marked as Read Today
                            </span>
                        ) : (
                            "Mark as Read"
                        )}
                    </button>
                </div>
            </div>

            {/* Encouragement Message */}
            {showEncouragement && (
                <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl animate-bounce">
                    <p className="font-medium">🎉 Well done! Keep growing in faith!</p>
                </div>
            )}

            {/* Grace-Centered Message */}
            <div className="card bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <h3 className="text-xl font-bold mb-3">Remember</h3>
                <p className="leading-relaxed opacity-90">
                    This streak is meant to encourage consistency, not create pressure. God&apos;s grace isn&apos;t measured in numbers. Whether your streak is 1 day or 100 days, you&apos;re growing in your walk with Christ.
                </p>
            </div>
        </div>
    );
}
