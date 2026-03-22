export interface DailyVerseRotationItem {
    verseId: string;
    referenceLabel: string;
    focus: string;
    reflectionPrompt: string;
}

export interface DailyVerseScheduleItem extends DailyVerseRotationItem {
    date: string;
    dateLabel: string;
    dayOffset: number;
}

export const DAILY_VERSE_ROTATION: DailyVerseRotationItem[] = [
    {
        verseId: 'JHN.3.16',
        referenceLabel: 'John 3:16',
        focus: 'Receive the love of God again.',
        reflectionPrompt: 'How can you rest more fully in the love God has already shown you today?',
    },
    {
        verseId: 'PSA.23.1',
        referenceLabel: 'Psalm 23:1',
        focus: 'Let God shepherd your pace.',
        reflectionPrompt: 'Where do you need to trust the Lord as your Shepherd instead of striving in your own strength?',
    },
    {
        verseId: 'PRO.3.5-6',
        referenceLabel: 'Proverbs 3:5-6',
        focus: 'Surrender the path in front of you.',
        reflectionPrompt: 'What decision or uncertainty do you need to place back in God\'s hands today?',
    },
    {
        verseId: 'ROM.8.28',
        referenceLabel: 'Romans 8:28',
        focus: 'Remember God is still at work.',
        reflectionPrompt: 'Where have you been tempted to lose hope, and how does this verse invite you to trust God\'s bigger story?',
    },
    {
        verseId: 'PHP.4.13',
        referenceLabel: 'Philippians 4:13',
        focus: 'Lean on Christ for strength.',
        reflectionPrompt: 'What assignment, conversation, or burden needs Christ\'s strength more than your own effort today?',
    },
    {
        verseId: 'JER.29.11',
        referenceLabel: 'Jeremiah 29:11',
        focus: 'Trust God with the future.',
        reflectionPrompt: 'How can you exchange anxiety about tomorrow for trust in God\'s faithful plans today?',
    },
    {
        verseId: 'ISA.40.31',
        referenceLabel: 'Isaiah 40:31',
        focus: 'Wait with expectation, not fear.',
        reflectionPrompt: 'Where is God asking you to wait on Him so your strength can be renewed?',
    },
    {
        verseId: 'MAT.28.20',
        referenceLabel: 'Matthew 28:20',
        focus: 'Live aware of Christ\'s presence.',
        reflectionPrompt: 'How would your day change if you stayed conscious that Jesus is with you in every moment?',
    },
    {
        verseId: 'PSA.46.1',
        referenceLabel: 'Psalm 46:1',
        focus: 'Run to God as your refuge.',
        reflectionPrompt: 'What pressure or fear can you bring to God as your present help today?',
    },
    {
        verseId: '1CO.13.4-7',
        referenceLabel: '1 Corinthians 13:4-7',
        focus: 'Practice Christlike love in action.',
        reflectionPrompt: 'Who needs patience, kindness, or steady love from you in a practical way today?',
    },
];

function getUtcStartOfDay(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function getDayOfYear(date: Date): number {
    const utcDate = getUtcStartOfDay(date);
    const startOfYear = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 0));
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    return Math.floor((utcDate.getTime() - startOfYear.getTime()) / millisecondsPerDay);
}

export function getDailyVerseDateLabel(date: Date = new Date()): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(getUtcStartOfDay(date));
}

export function getDailyVerseRotationItem(date: Date = new Date()): DailyVerseRotationItem {
    const dayOfYear = getDayOfYear(date);
    return DAILY_VERSE_ROTATION[dayOfYear % DAILY_VERSE_ROTATION.length];
}

export function getUpcomingDailyVerseSchedule(days: number = 7, startDate: Date = new Date()): DailyVerseScheduleItem[] {
    const normalizedDays = Math.max(1, Math.floor(days));
    const utcStart = getUtcStartOfDay(startDate);

    return Array.from({ length: normalizedDays }, (_, index) => {
        const scheduledDate = new Date(utcStart.getTime() + index * 24 * 60 * 60 * 1000);
        const rotationItem = getDailyVerseRotationItem(scheduledDate);

        return {
            ...rotationItem,
            date: scheduledDate.toISOString(),
            dateLabel: getDailyVerseDateLabel(scheduledDate),
            dayOffset: index,
        };
    });
}
