import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

const INVALID_ENV_LITERALS = new Set(['', 'undefined', 'null']);

function normalizeEnvValue(value: string | undefined): string | undefined {
    const trimmedValue = value?.trim();

    if (!trimmedValue) {
        return undefined;
    }

    return INVALID_ENV_LITERALS.has(trimmedValue.toLowerCase()) ? undefined : trimmedValue;
}

function isRemoteLibsqlUrl(value: string | undefined): value is string {
    return Boolean(value && /^(libsql|https?):\/\//i.test(value));
}

function assertValidRemoteDatabaseUrl(value: string): void {
    try {
        new URL(value);
    } catch {
        throw new Error(
            'DATABASE_URL must be a valid libSQL/Turso connection string when using a remote database.'
        );
    }
}

const databaseUrl = normalizeEnvValue(process.env.DATABASE_URL);
const databaseAuthToken = normalizeEnvValue(process.env.DATABASE_AUTH_TOKEN);
const useRemoteLibsql = isRemoteLibsqlUrl(databaseUrl);

if (useRemoteLibsql && !databaseAuthToken) {
    throw new Error(
        'DATABASE_AUTH_TOKEN is required when DATABASE_URL points to a remote libSQL/Turso database.'
    );
}

if (process.env.NODE_ENV === 'production' && !databaseUrl) {
    throw new Error(
        'DATABASE_URL is missing in production. Set it to your Turso/libSQL database URL in the deployment environment.'
    );
}

let prisma: PrismaClient;

if (useRemoteLibsql) {
    // Use Turso (production/cloud)
    assertValidRemoteDatabaseUrl(databaseUrl);

    const adapter = new PrismaLibSQL({
        url: databaseUrl,
        authToken: databaseAuthToken,
    });

    prisma = global.prisma || new PrismaClient({
        adapter: adapter as any,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
} else {
    // Use local SQLite file (development)
    prisma = global.prisma || new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
}

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;
