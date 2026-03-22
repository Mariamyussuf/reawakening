import type { Conference } from '@prisma/client';

export const CONFERENCE_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;

export type ConferenceStatus = (typeof CONFERENCE_STATUSES)[number];

export interface SerializedConference {
    id: string;
    theme: string;
    summary: string;
    venue: string;
    timeLabel: string;
    costLabel: string;
    registrationUrl: string | null;
    details: string | null;
    startDate: string;
    endDate: string | null;
    isOnline: boolean;
    registrationOpen: boolean;
    featured: boolean;
    status: ConferenceStatus;
    dateLabel: string;
    createdAt: string;
    updatedAt: string;
}

export function normalizeConferenceStatus(value: string | null | undefined): ConferenceStatus {
    const normalizedValue = value?.toUpperCase();

    if (normalizedValue === 'PUBLISHED' || normalizedValue === 'ARCHIVED') {
        return normalizedValue;
    }

    return 'DRAFT';
}

export function formatConferenceDateRange(
    startDateInput: Date | string,
    endDateInput?: Date | string | null
): string {
    const startDate = new Date(startDateInput);

    if (Number.isNaN(startDate.getTime())) {
        return 'Date to be announced';
    }

    const endDate = endDateInput ? new Date(endDateInput) : null;

    if (!endDate || Number.isNaN(endDate.getTime())) {
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }).format(startDate);
    }

    const sameYear = startDate.getFullYear() === endDate.getFullYear();
    const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();

    if (sameMonth) {
        return `${new Intl.DateTimeFormat('en-US', {
            month: 'long',
        }).format(startDate)} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
    }

    if (sameYear) {
        return `${new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
        }).format(startDate)} - ${new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(endDate)}`;
    }

    return `${new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(startDate)} - ${new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(endDate)}`;
}

export function serializeConference(conference: Conference): SerializedConference {
    const status = normalizeConferenceStatus(conference.status);

    return {
        id: conference.id,
        theme: conference.theme,
        summary: conference.summary,
        venue: conference.venue,
        timeLabel: conference.timeLabel,
        costLabel: conference.costLabel,
        registrationUrl: conference.registrationUrl,
        details: conference.details,
        startDate: conference.startDate.toISOString(),
        endDate: conference.endDate?.toISOString() ?? null,
        isOnline: conference.isOnline,
        registrationOpen: conference.registrationOpen,
        featured: conference.featured,
        status,
        dateLabel: formatConferenceDateRange(conference.startDate, conference.endDate),
        createdAt: conference.createdAt.toISOString(),
        updatedAt: conference.updatedAt.toISOString(),
    };
}

export function isMissingConferenceSchemaError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const code = 'code' in error && typeof error.code === 'string' ? error.code : '';
    const message = 'message' in error && typeof error.message === 'string' ? error.message.toLowerCase() : '';

    if (code === 'P2021' || code === 'P2022') {
        return true;
    }

    const referencesConferenceSchema =
        message.includes('conference') ||
        message.includes('conferences') ||
        message.includes('featured') ||
        message.includes('registrationopen') ||
        message.includes('registrationurl') ||
        message.includes('costlabel');

    const indicatesMissingSchema =
        message.includes('does not exist') ||
        message.includes('no such table') ||
        message.includes('no such column') ||
        (message.includes('table') && message.includes('missing')) ||
        (message.includes('column') && message.includes('missing'));

    return referencesConferenceSchema && indicatesMissingSchema;
}
