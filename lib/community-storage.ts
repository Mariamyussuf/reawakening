"use client";

const isBrowser = typeof window !== "undefined";

export function readStoredIds(key: string): string[] {
    if (!isBrowser) {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
    } catch {
        return [];
    }
}

export function writeStoredIds(key: string, values: string[]) {
    if (!isBrowser) {
        return;
    }

    window.localStorage.setItem(key, JSON.stringify(values));
}

export function readStoredItems<T>(key: string): T[] {
    if (!isBrowser) {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
        return [];
    }
}

export function writeStoredItems<T>(key: string, values: T[]) {
    if (!isBrowser) {
        return;
    }

    window.localStorage.setItem(key, JSON.stringify(values));
}
