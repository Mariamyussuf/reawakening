import mongoose, { Schema, Model } from 'mongoose';

export interface IJournalEntry {
    _id: string;
    userId: mongoose.Types.ObjectId;
    title?: string;
    content: string;
    category: string;
    mood?: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const JournalEntrySchema = new Schema<IJournalEntry>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Journal entry must belong to a user'],
            index: true,
        },
        title: {
            type: String,
            maxlength: [200, 'Title cannot be more than 200 characters'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Please provide journal content'],
            maxlength: [5000, 'Content cannot be more than 5000 characters'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Please provide a category'],
            enum: ['general', 'morning', 'evening', 'gratitude', 'answered', 'study', 'prayer', 'reflection', 'other'],
            default: 'general',
        },
        mood: {
            type: String,
            enum: ['grateful', 'joyful', 'hopeful', 'peaceful', 'anxious', 'sad', 'confused', 'excited', 'other'],
        },
        tags: [{
            type: String,
            trim: true,
            maxlength: [30, 'Tag cannot be more than 30 characters'],
        }],
    },
    {
        timestamps: true,
    }
);

// Create indexes
JournalEntrySchema.index({ userId: 1, createdAt: -1 });
JournalEntrySchema.index({ userId: 1, category: 1 });
JournalEntrySchema.index({ userId: 1, tags: 1 });
// Full-text search index
JournalEntrySchema.index({ title: 'text', content: 'text', tags: 'text' });

const JournalEntry: Model<IJournalEntry> = mongoose.models.JournalEntry || mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);

export default JournalEntry;
