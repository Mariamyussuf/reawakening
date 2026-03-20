import { z } from 'zod';

/**
 * Environment variable validation
 * Validates all required environment variables on app startup
 * Provides clear error messages if variables are missing or invalid
 */

// Schema for required environment variables
const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

    // NextAuth
    NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
    NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL').optional(),

    // Optional: Upstash Redis (for rate limiting)
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

    // Optional: Bible API
    BIBLE_API_KEY: z.string().optional(),

    // Optional: Test mode (development only)
    NEXT_PUBLIC_TEST_MODE: z.string().optional(),

    // Node environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Type for validated environment variables
export type Env = z.infer<typeof envSchema>;

/**
 * Validated environment variables
 * Throws error with clear message if validation fails
 */
let validatedEnv: Env | null = null;

/**
 * Get validated environment variables
 * Validates on first call and caches result
 */
export function getEnv(): Env {
    if (validatedEnv) {
        return validatedEnv;
    }

    try {
        validatedEnv = envSchema.parse({
            DATABASE_URL: process.env.DATABASE_URL,
            NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
            NEXTAUTH_URL: process.env.NEXTAUTH_URL,
            UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
            UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
            BIBLE_API_KEY: process.env.BIBLE_API_KEY,
            NEXT_PUBLIC_TEST_MODE: process.env.NEXT_PUBLIC_TEST_MODE,
            NODE_ENV: process.env.NODE_ENV || 'development',
        });

        return validatedEnv;
    } catch (error) {
        if (error instanceof z.ZodError) {
            const missingVars = error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`);
            throw new Error(
                `Environment variable validation failed:\n${missingVars.join('\n')}\n\n` +
                    'Please check your .env file and ensure all required variables are set.'
            );
        }
        throw error;
    }
}

/**
 * Validate environment variables (call this early in app startup)
 * Useful for catching configuration errors before the app starts
 */
export function validateEnv(): void {
    getEnv();
}

// Export individual env vars for convenience (validated)
export const env = {
    get DATABASE_URL() {
        return getEnv().DATABASE_URL;
    },
    get NEXTAUTH_SECRET() {
        return getEnv().NEXTAUTH_SECRET;
    },
    get NEXTAUTH_URL() {
        return getEnv().NEXTAUTH_URL;
    },
    get UPSTASH_REDIS_REST_URL() {
        return getEnv().UPSTASH_REDIS_REST_URL;
    },
    get UPSTASH_REDIS_REST_TOKEN() {
        return getEnv().UPSTASH_REDIS_REST_TOKEN;
    },
    get BIBLE_API_KEY() {
        return getEnv().BIBLE_API_KEY;
    },
    get NEXT_PUBLIC_TEST_MODE() {
        return getEnv().NEXT_PUBLIC_TEST_MODE;
    },
    get NODE_ENV() {
        return getEnv().NODE_ENV;
    },
    get IS_PRODUCTION() {
        return getEnv().NODE_ENV === 'production';
    },
    get IS_DEVELOPMENT() {
        return getEnv().NODE_ENV === 'development';
    },
};

// Validate on module load (in development, this helps catch errors early)
if (process.env.NODE_ENV !== 'test') {
    try {
        validateEnv();
    } catch (error) {
        // Only throw in production - in development, allow missing optional vars
        if (process.env.NODE_ENV === 'production') {
            console.error('❌ Environment validation failed:', error);
            throw error;
        } else {
            console.warn('⚠️  Environment validation warning:', error);
        }
    }
}
