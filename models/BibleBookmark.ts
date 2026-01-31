import mongoose, { Schema, Model } from 'mongoose';

export interface IBibleBookmark {
    _id: string;
    userId: mongoose.Types.ObjectId;
    version: string; // Bible version (KJV, NIV, etc.)
    bookId: string; // Book ID (e.g., 'JHN' for John)
    bookName: string; // Book name (e.g., 'John')
    chapter: number;
    verse?: number; // Optional: specific verse, or null for entire chapter
    verseText?: string; // The actual verse text
    reference: string; // Human-readable reference (e.g., 'John 3:16')
    note?: string; // Optional note
    color?: string; // Highlight color (yellow, green, blue, pink, purple)
    createdAt: Date;
    updatedAt: Date;
}

const BibleBookmarkSchema = new Schema<IBibleBookmark>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Bookmark must belong to a user'],
            index: true,
        },
        version: {
            type: String,
            required: [true, 'Please provide Bible version'],
            default: 'KJV',
        },
        bookId: {
            type: String,
            required: [true, 'Please provide book ID'],
        },
        bookName: {
            type: String,
            required: [true, 'Please provide book name'],
        },
        chapter: {
            type: Number,
            required: [true, 'Please provide chapter number'],
            min: [1, 'Chapter must be at least 1'],
        },
        verse: {
            type: Number,
            min: [1, 'Verse must be at least 1'],
        },
        verseText: {
            type: String,
            maxlength: [1000, 'Verse text cannot be more than 1000 characters'],
        },
        reference: {
            type: String,
            required: [true, 'Please provide reference'],
            maxlength: [100, 'Reference cannot be more than 100 characters'],
        },
        note: {
            type: String,
            maxlength: [500, 'Note cannot be more than 500 characters'],
        },
        color: {
            type: String,
            enum: ['yellow', 'green', 'blue', 'pink', 'purple'],
            default: 'yellow',
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes
BibleBookmarkSchema.index({ userId: 1, createdAt: -1 });
BibleBookmarkSchema.index({ userId: 1, bookId: 1, chapter: 1, verse: 1 });
BibleBookmarkSchema.index({ userId: 1, version: 1 });

const BibleBookmark: Model<IBibleBookmark> = mongoose.models.BibleBookmark || mongoose.model<IBibleBookmark>('BibleBookmark', BibleBookmarkSchema);

export default BibleBookmark;
