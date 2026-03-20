import { z } from 'zod';

/**
 * Common validation schemas
 */

// User schemas
export const RegisterSchema = z.object({
    name: z.string().min(1, 'Name is required').max(60, 'Name cannot exceed 60 characters'),
    email: z.string().email('Invalid email address').toLowerCase(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const UpdateProfileSchema = z.object({
    name: z.string().min(1).max(60).optional(),
    phone: z.string().optional(),
    campus: z.string().optional(),
    bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
    avatar: z.string().url().optional(),
});

export const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
});

// Prayer schemas
export const PrayerSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description cannot exceed 1000 characters'),
    category: z.enum(['general', 'health', 'family', 'finances', 'career', 'education', 'spiritual', 'other']).optional(),
    isAnonymous: z.boolean().optional(),
});

export const UpdatePrayerSchema = PrayerSchema.partial();

// Devotional schemas
export const DevotionalSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
    content: z.string().min(1, 'Content is required'),
    excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt cannot exceed 500 characters'),
    author: z.string().min(1, 'Author is required').max(100, 'Author name cannot exceed 100 characters'),
    status: z.enum(['draft', 'scheduled', 'published']),
    publishDate: z.string().datetime().optional(),
    scheduledDate: z.string().datetime().optional(),
    scripture: z.string().max(200, 'Scripture reference cannot exceed 200 characters').optional(),
    tags: z.array(z.string().max(30, 'Tag cannot exceed 30 characters')).optional(),
});

export const UpdateDevotionalSchema = DevotionalSchema.partial();

// Journal entry schemas
export const JournalEntrySchema = z.object({
    title: z.string().max(200, 'Title cannot exceed 200 characters').optional(),
    content: z.string().min(1, 'Content is required').max(5000, 'Content cannot exceed 5000 characters'),
    category: z.enum(['general', 'morning', 'evening', 'gratitude', 'answered', 'study', 'prayer', 'reflection', 'other']),
    mood: z.enum(['grateful', 'joyful', 'hopeful', 'peaceful', 'anxious', 'sad', 'confused', 'excited', 'other']).optional(),
    tags: z.array(z.string().max(30, 'Tag cannot exceed 30 characters')).optional(),
});

export const UpdateJournalEntrySchema = JournalEntrySchema.partial();

// Book schemas
export const BookSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
    author: z.string().min(1, 'Author is required').max(100, 'Author name cannot exceed 100 characters'),
    description: z.string().min(1, 'Description is required').max(2000, 'Description cannot exceed 2000 characters'),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string().max(30, 'Tag cannot exceed 30 characters')).optional(),
    publishYear: z.number().int().min(1000).max(new Date().getFullYear() + 1).optional(),
    publisher: z.string().max(100, 'Publisher name cannot exceed 100 characters').optional(),
    isbn: z.string().optional(),
    language: z.string().default('en'),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    featured: z.boolean().optional(),
    popular: z.boolean().optional(),
    newRelease: z.boolean().optional(),
});

export const UpdateBookSchema = BookSchema.partial();

// Bible bookmark schemas
export const BibleBookmarkSchema = z.object({
    version: z.string().min(1, 'Version is required'),
    bookId: z.string().min(1, 'Book ID is required'),
    bookName: z.string().min(1, 'Book name is required'),
    chapter: z.number().int().min(1),
    verse: z.number().int().min(1).optional(),
    verseText: z.string().optional(),
    reference: z.string().min(1, 'Reference is required'),
    note: z.string().optional(),
    color: z.enum(['yellow', 'green', 'blue', 'pink', 'purple', 'orange']).default('yellow'),
});

export const UpdateBibleBookmarkSchema = BibleBookmarkSchema.partial();

// Pagination schema
export const PaginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    skip: z.coerce.number().int().min(0).optional(),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('desc').optional(),
});

// Search schema
export const SearchSchema = z.object({
    q: z.string().min(1, 'Search query is required'),
    type: z.enum(['all', 'books', 'devotionals', 'prayers']).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    skip: z.coerce.number().int().min(0).default(0).optional(),
});

// User role update schema
export const UpdateUserRoleSchema = z.object({
    role: z.enum(['member', 'leader', 'admin']),
});

// Account deletion schema
export const DeleteAccountSchema = z.object({
    password: z.string().min(1, 'Password is required to confirm account deletion'),
});

// Preferences schema
export const UpdatePreferencesSchema = z.object({
    notifications: z.object({
        email: z.boolean().optional(),
        push: z.boolean().optional(),
        prayer: z.boolean().optional(),
        devotional: z.boolean().optional(),
    }).optional(),
    privacy: z.object({
        profileVisibility: z.enum(['public', 'members', 'private']).optional(),
        showEmail: z.boolean().optional(),
        showPhone: z.boolean().optional(),
    }).optional(),
});

// Export all schemas
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type PrayerInput = z.infer<typeof PrayerSchema>;
export type UpdatePrayerInput = z.infer<typeof UpdatePrayerSchema>;
export type DevotionalInput = z.infer<typeof DevotionalSchema>;
export type UpdateDevotionalInput = z.infer<typeof UpdateDevotionalSchema>;
export type JournalEntryInput = z.infer<typeof JournalEntrySchema>;
export type UpdateJournalEntryInput = z.infer<typeof UpdateJournalEntrySchema>;
export type BookInput = z.infer<typeof BookSchema>;
export type UpdateBookInput = z.infer<typeof UpdateBookSchema>;
export type BibleBookmarkInput = z.infer<typeof BibleBookmarkSchema>;
export type UpdateBibleBookmarkInput = z.infer<typeof UpdateBibleBookmarkSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
export type SearchInput = z.infer<typeof SearchSchema>;
export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;
