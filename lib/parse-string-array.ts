export function parseStoredStringArray(value: string | null | undefined): string[] {
    if (!value) {
        return [];
    }

    const normalizeItems = (items: unknown[]): string[] =>
        items
            .filter((item): item is string => typeof item === 'string')
            .map((item) => item.trim())
            .filter(Boolean);

    try {
        const parsed = JSON.parse(value) as unknown;

        if (Array.isArray(parsed)) {
            return normalizeItems(parsed);
        }

        if (typeof parsed === 'string') {
            return parsed
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
        }
    } catch {
        return value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
}
