import type { Devotional } from '@prisma/client';

import { parseStoredStringArray } from '@/lib/parse-string-array';

export const DEVOTIONAL_STATUSES = ['DRAFT', 'SCHEDULED', 'PUBLISHED'] as const;

export type DevotionalStatus = (typeof DEVOTIONAL_STATUSES)[number];

export interface SerializedDevotional {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    coverImage: string | null;
    publishDate: string;
    scheduledDate: string | null;
    status: DevotionalStatus;
    tags: string[];
    scripture: string | null;
    createdAt: string;
    updatedAt: string;
}

export function normalizeDevotionalStatus(value: string | null | undefined): DevotionalStatus {
    const normalizedValue = value?.toUpperCase();

    if (normalizedValue === 'SCHEDULED' || normalizedValue === 'PUBLISHED') {
        return normalizedValue;
    }

    return 'DRAFT';
}

export function serializeDevotional(devotional: Devotional): SerializedDevotional {
    return {
        id: devotional.id,
        title: devotional.title,
        content: devotional.content,
        excerpt: devotional.excerpt,
        author: devotional.author,
        coverImage: devotional.coverImage ?? null,
        publishDate: devotional.publishDate.toISOString(),
        scheduledDate: devotional.scheduledDate?.toISOString() ?? null,
        status: normalizeDevotionalStatus(devotional.status),
        tags: parseStoredStringArray(devotional.tags),
        scripture: devotional.scripture ?? null,
        createdAt: devotional.createdAt.toISOString(),
        updatedAt: devotional.updatedAt.toISOString(),
    };
}

export function isMissingDevotionalsTableError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const code = 'code' in error && typeof error.code === 'string' ? error.code : '';
    const message = 'message' in error && typeof error.message === 'string' ? error.message.toLowerCase() : '';

    if (code === 'P2021') {
        return true;
    }

    return (
        message.includes('devotionals') &&
        (
            message.includes('does not exist') ||
            message.includes('no such table') ||
            message.includes('table') && message.includes('missing')
        )
    );
}
