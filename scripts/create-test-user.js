const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'test@example.com';
    const password = 'Password123!';
    const name = 'Test User';
    const role = 'MEMBER';

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log(`User with email ${email} already exists. Updating password...`);
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                name,
                role,
            },
        });
        console.log('User updated successfully.');
    } else {
        console.log(`Creating new user: ${email}`);
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
            },
        });
        console.log('User created successfully.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
