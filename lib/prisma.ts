import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// Determine which database to use
const useTurso = process.env.DATABASE_URL?.startsWith('libsql://');

let prisma: PrismaClient;

if (useTurso) {
    // Use Turso (production/cloud)
    const libsql = createClient({
        url: process.env.DATABASE_URL!,
        authToken: process.env.DATABASE_AUTH_TOKEN,
    });

    const adapter = new PrismaLibSql(libsql as any);

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
