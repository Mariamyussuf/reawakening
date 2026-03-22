import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { env } from '@/lib/env';

function normalizeRole(role: string | null | undefined): 'member' | 'admin' | 'leader' {
    const normalizedRole = role?.toLowerCase();

    if (normalizedRole === 'admin' || normalizedRole === 'leader') {
        return normalizedRole;
    }

    return 'member';
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter your email and password');
                }

                // Find user
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) {
                    throw new Error('No user found with this email');
                }

                // Check password
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                // Update last active
                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastActive: new Date() }
                });

                const normalizedRole = normalizeRole(user.role);

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: normalizedRole,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = normalizeRole(typeof user.role === 'string' ? user.role : undefined);
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = normalizeRole(typeof token.role === 'string' ? token.role : undefined);
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: env.NEXTAUTH_SECRET,
};
