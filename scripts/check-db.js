const { PrismaClient } = require('@prisma/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');

const INVALID_ENV_LITERALS = new Set(['', 'undefined', 'null']);

function normalizeEnvValue(value) {
    if (typeof value !== 'string') {
        return undefined;
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
        return undefined;
    }

    return INVALID_ENV_LITERALS.has(trimmedValue.toLowerCase()) ? undefined : trimmedValue;
}

function maskValue(value) {
    if (!value) {
        return 'missing';
    }

    if (value.length <= 8) {
        return `${value.slice(0, 2)}***`;
    }

    return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function getDatabaseMode(databaseUrl, databaseAuthToken) {
    if (/^(libsql|https?):\/\//i.test(databaseUrl || '')) {
        return databaseAuthToken ? 'remote-libsql' : 'remote-libsql-missing-token';
    }

    return 'local-prisma';
}

async function createPrismaClient() {
    const databaseUrl = normalizeEnvValue(process.env.DATABASE_URL);
    const databaseAuthToken = normalizeEnvValue(process.env.DATABASE_AUTH_TOKEN);
    const mode = getDatabaseMode(databaseUrl, databaseAuthToken);

    console.log('Database connection check');
    console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`- DATABASE_URL: ${maskValue(databaseUrl)}`);
    console.log(`- DATABASE_AUTH_TOKEN: ${maskValue(databaseAuthToken)}`);
    console.log(`- Mode: ${mode}`);

    if (mode === 'remote-libsql-missing-token') {
        throw new Error('DATABASE_AUTH_TOKEN is required when DATABASE_URL points to a remote libSQL/Turso database.');
    }

    if (mode === 'remote-libsql') {
        let parsedUrl;

        try {
            parsedUrl = new URL(databaseUrl);
        } catch {
            throw new Error(`DATABASE_URL is invalid: ${databaseUrl}`);
        }

        console.log(`- Host: ${parsedUrl.host}`);

        const adapter = new PrismaLibSQL({
            url: databaseUrl,
            authToken: databaseAuthToken,
        });

        return new PrismaClient({ adapter });
    }

    return new PrismaClient();
}

async function main() {
    const prisma = await createPrismaClient();

    try {
        console.log('- Connecting...');
        await prisma.$connect();
        console.log('- Connected successfully');

        const userCount = await prisma.user.count();
        console.log(`- User count query succeeded: ${userCount}`);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error) => {
    console.error('Connection test failed');
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
