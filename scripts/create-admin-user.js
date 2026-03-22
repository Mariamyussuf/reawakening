const { PrismaClient } = require('@prisma/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');
const bcrypt = require('bcryptjs');
const path = require('path');

const INVALID_ENV_LITERALS = new Set(['', 'undefined', 'null']);

function normalizeEnvValue(value) {
    if (typeof value !== 'string') {
        return undefined;
    }

    const trimmed = value.trim();

    if (!trimmed) {
        return undefined;
    }

    return INVALID_ENV_LITERALS.has(trimmed.toLowerCase()) ? undefined : trimmed;
}

function isRemoteLibsqlUrl(value) {
    return Boolean(value && /^(libsql|https?):\/\//i.test(value));
}

function toLocalFileUrl(filePath) {
    return `file:${filePath.replace(/\\/g, '/')}`;
}

function getLocalDatabaseUrl(databaseUrl) {
    const configuredLocalUrl =
        normalizeEnvValue(process.env.LOCAL_DATABASE_URL) ||
        (databaseUrl && databaseUrl.startsWith('file:') ? databaseUrl : undefined);

    if (configuredLocalUrl && configuredLocalUrl.startsWith('file:')) {
        return configuredLocalUrl;
    }

    return toLocalFileUrl(path.resolve(process.cwd(), 'prisma', 'dev.db'));
}

function createPrismaClient() {
    const databaseUrl = normalizeEnvValue(process.env.DATABASE_URL);
    const databaseAuthToken = normalizeEnvValue(process.env.DATABASE_AUTH_TOKEN);
    const adapter = new PrismaLibSQL(
        isRemoteLibsqlUrl(databaseUrl)
            ? {
                  url: databaseUrl,
                  authToken: databaseAuthToken,
              }
            : {
                  url: getLocalDatabaseUrl(databaseUrl),
              }
    );

    return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

function readArg(flag) {
    const index = process.argv.indexOf(flag);

    if (index === -1) {
        return undefined;
    }

    return process.argv[index + 1];
}

function normalizeOptional(value) {
    if (typeof value !== 'string') {
        return undefined;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
}

function printUsage() {
    console.log('Usage: npm run admin:create -- --name "Admin Name" --email "admin@example.com" --password "StrongPassword123!"');
    console.log('Optional: --phone "080..." --campus "Campus Name" --bio "Short bio"');
    console.log('If the email already exists, this command will upgrade that user to ADMIN.');
}

async function main() {
    const name = normalizeOptional(readArg('--name'));
    const email = normalizeOptional(readArg('--email'))?.toLowerCase();
    const password = normalizeOptional(readArg('--password'));
    const phone = normalizeOptional(readArg('--phone'));
    const campus = normalizeOptional(readArg('--campus'));
    const bio = normalizeOptional(readArg('--bio'));

    if (!name || !email) {
        printUsage();
        throw new Error('Both --name and --email are required.');
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (!existingUser && !password) {
        printUsage();
        throw new Error('--password is required when creating a new admin user.');
    }

    const data = {
        name,
        role: 'ADMIN',
        ...(phone ? { phone } : {}),
        ...(campus ? { campus } : {}),
        ...(bio ? { bio } : {}),
        ...(password ? { password: await bcrypt.hash(password, 12) } : {}),
    };

    if (existingUser) {
        await prisma.user.update({
            where: { email },
            data,
        });

        console.log(`Updated ${email} and assigned ADMIN role.`);
        return;
    }

    await prisma.user.create({
        data: {
            email,
            ...data,
        },
    });

    console.log(`Created admin user for ${email}.`);
}

main()
    .catch((error) => {
        console.error(error.message || error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
