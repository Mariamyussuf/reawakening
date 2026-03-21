import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const INVALID_ENV_LITERALS = new Set(['', 'undefined', 'null']);

function normalizeEnvValue(value: string | undefined): string | undefined {
    const trimmedValue = value?.trim();

    if (!trimmedValue) {
        return undefined;
    }

    return INVALID_ENV_LITERALS.has(trimmedValue.toLowerCase()) ? undefined : trimmedValue;
}

function maskValue(value: string | undefined): string {
    if (!value) {
        return 'missing';
    }

    if (value.length <= 8) {
        return `${value.slice(0, 2)}***`;
    }

    return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function getDatabaseMode(databaseUrl: string | undefined, databaseAuthToken: string | undefined): string {
    if (/^(libsql|https?):\/\//i.test(databaseUrl || '')) {
        return databaseAuthToken ? 'remote-libsql' : 'remote-libsql-missing-token';
    }

    return databaseUrl ? 'local-prisma' : 'missing-database-url';
}

function isAuthorized(request: NextRequest): boolean {
    const debugKey = normalizeEnvValue(request.headers.get('x-debug-key') || undefined);
    const configuredSecret = normalizeEnvValue(process.env.NEXTAUTH_SECRET);

    return Boolean(configuredSecret && debugKey && debugKey === configuredSecret);
}

async function runRemoteProbe(databaseUrl: string, databaseAuthToken: string) {
    const libsql = createClient({
        url: databaseUrl,
        authToken: databaseAuthToken,
    });

    try {
        const result = await libsql.execute('select 1 as ok');

        return {
            success: true,
            rows: result.rows.length,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    } finally {
        await libsql.close();
    }
}

export async function GET(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json(
            { error: 'Not found' },
            { status: 404 }
        );
    }

    const databaseUrl = normalizeEnvValue(process.env.DATABASE_URL);
    const databaseAuthToken = normalizeEnvValue(process.env.DATABASE_AUTH_TOKEN);
    const nextAuthSecret = normalizeEnvValue(process.env.NEXTAUTH_SECRET);
    const mode = getDatabaseMode(databaseUrl, databaseAuthToken);

    let parsedUrl: URL | null = null;
    let parseError: string | null = null;

    if (databaseUrl) {
        try {
            parsedUrl = new URL(databaseUrl);
        } catch (error) {
            parseError = error instanceof Error ? error.message : String(error);
        }
    }

    const diagnostics: Record<string, unknown> = {
        nodeEnv: process.env.NODE_ENV || 'development',
        vercelEnv: process.env.VERCEL_ENV || 'missing',
        vercelRegion: process.env.VERCEL_REGION || 'missing',
        hasDatabaseUrl: Boolean(databaseUrl),
        databaseUrlMasked: maskValue(databaseUrl),
        databaseUrlProtocol: parsedUrl?.protocol || 'missing',
        databaseUrlHost: parsedUrl?.host || 'missing',
        hasDatabaseAuthToken: Boolean(databaseAuthToken),
        databaseAuthTokenMasked: maskValue(databaseAuthToken),
        hasNextAuthSecret: Boolean(nextAuthSecret),
        nextAuthSecretMasked: maskValue(nextAuthSecret),
        inferredMode: mode,
        parseError,
        deployment: {
            gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA || 'missing',
            gitCommitRef: process.env.VERCEL_GIT_COMMIT_REF || 'missing',
        },
    };

    if (mode === 'remote-libsql' && databaseUrl && databaseAuthToken) {
        diagnostics.remoteProbe = await runRemoteProbe(databaseUrl, databaseAuthToken);
    }

    if (mode === 'remote-libsql-missing-token') {
        diagnostics.remoteProbe = {
            success: false,
            error: 'DATABASE_AUTH_TOKEN is missing for a remote libSQL/Turso URL.',
        };
    }

    if (mode === 'missing-database-url') {
        diagnostics.remoteProbe = {
            success: false,
            error: 'DATABASE_URL is missing at runtime.',
        };
    }

    return NextResponse.json({
        success: true,
        diagnostics,
        note: 'Temporary debug route. Remove after diagnosing the deployment environment.',
    });
}
