require('dotenv/config');

const fs = require('fs');
const { createClient } = require('@libsql/client');

const INVALID_ENV_LITERALS = new Set(['', 'undefined', 'null']);
const localDatabasePath = './prisma/dev.db';

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

function toLocalFileUrl(filePath) {
    return `file:${filePath.replace(/\\/g, '/')}`;
}

function makeStatementIdempotent(sql) {
    return sql
        .replace(/^CREATE TABLE /i, 'CREATE TABLE IF NOT EXISTS ')
        .replace(/^CREATE INDEX /i, 'CREATE INDEX IF NOT EXISTS ')
        .replace(/^CREATE UNIQUE INDEX /i, 'CREATE UNIQUE INDEX IF NOT EXISTS ')
        .replace(/^CREATE TRIGGER /i, 'CREATE TRIGGER IF NOT EXISTS ');
}

async function main() {
    const databaseUrl =
        normalizeEnvValue(process.env.TURSO_DATABASE_URL) ||
        normalizeEnvValue(process.env.REMOTE_DATABASE_URL) ||
        normalizeEnvValue(process.env.DATABASE_URL);
    const databaseAuthToken = normalizeEnvValue(process.env.DATABASE_AUTH_TOKEN);

    console.log('Syncing schema to Turso/libSQL...\n');

    if (!fs.existsSync(localDatabasePath)) {
        throw new Error(`Local database not found at ${localDatabasePath}. Run: npx prisma db push`);
    }

    if (!databaseUrl) {
        throw new Error('Set TURSO_DATABASE_URL or REMOTE_DATABASE_URL to your remote libSQL/Turso database URL.');
    }

    if (databaseUrl.startsWith('file:')) {
        throw new Error(
            'The selected database URL points to a local SQLite file. Set TURSO_DATABASE_URL or REMOTE_DATABASE_URL to your remote libSQL/Turso URL before running this script.'
        );
    }

    if (!databaseAuthToken) {
        throw new Error('DATABASE_AUTH_TOKEN is missing.');
    }

    const localClient = createClient({ url: toLocalFileUrl(localDatabasePath) });
    const remoteClient = createClient({ url: databaseUrl, authToken: databaseAuthToken });

    try {
        console.log(`Reading schema from ${localDatabasePath}...`);
        const localSchema = await localClient.execute(`
            SELECT type, name, sql
            FROM sqlite_master
            WHERE sql IS NOT NULL
              AND type IN ('table', 'index', 'trigger')
              AND name NOT LIKE 'sqlite_%'
            ORDER BY
              CASE type
                WHEN 'table' THEN 1
                WHEN 'index' THEN 2
                WHEN 'trigger' THEN 3
                ELSE 4
              END,
              rowid
        `);

        const statements = localSchema.rows
            .map((row) => String(row.sql || '').trim())
            .filter(Boolean)
            .map(makeStatementIdempotent);

        if (statements.length === 0) {
            throw new Error('No schema statements were found in the local SQLite database.');
        }

        console.log(`Applying ${statements.length} schema statements to remote database...`);

        for (const statement of statements) {
            await remoteClient.execute(statement);
        }

        const remoteTables = await remoteClient.execute(`
            SELECT name
            FROM sqlite_master
            WHERE type = 'table'
              AND name NOT LIKE 'sqlite_%'
            ORDER BY name
        `);

        console.log('Schema synced successfully.');
        console.log('Remote tables:');
        for (const row of remoteTables.rows) {
            console.log(`- ${row.name}`);
        }
    } finally {
        await localClient.close();
        await remoteClient.close();
    }
}

main().catch((error) => {
    console.error('\nSchema sync failed:');
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
