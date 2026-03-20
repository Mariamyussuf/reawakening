import mongoose, { Schema, Model } from 'mongoose';

export interface IDevotional {
    _id: string;
    title: string;
    content: string; // Rich text HTML
    excerpt: string;
    author: string;
    coverImage?: string;
    publishDate: Date;
    scheduledDate?: Date;
    status: 'draft' | 'scheduled' | 'published';
    tags: string[];
    scripture?: string; // Bible verse reference
    createdAt: Date;
    updatedAt: Date;
}

const DevotionalSchema = new Schema<IDevotional>(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            maxlength: [200, 'Title cannot be more than 200 characters'],
            trim: true,
            index: 'text',
        },
        content: {
            type: String,
            required: [true, 'Please provide devotional content'],
            trim: true,
        },
        excerpt: {
            type: String,
            required: [true, 'Please provide an excerpt'],
            maxlength: [500, 'Excerpt cannot be more than 500 characters'],
            trim: true,
        },
        author: {
            type: String,
            required: [true, 'Please provide an author'],
            maxlength: [100, 'Author name cannot be more than 100 characters'],
            trim: true,
        },
        coverImage: {
            type: String,
            default: '',
        },
        publishDate: {
            type: Date,
            default: Date.now,
        },
        scheduledDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['draft', 'scheduled', 'published'],
            default: 'draft',
            index: true,
        },
        tags: [{
            type: String,
            trim: true,
            maxlength: [30, 'Tag cannot be more than 30 characters'],
        }],
        scripture: {
            type: String,
            maxlength: [200, 'Scripture reference cannot be more than 200 characters'],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes
DevotionalSchema.index({ status: 1, publishDate: -1 });
DevotionalSchema.index({ status: 1, scheduledDate: -1 });
DevotionalSchema.index({ tags: 1 });
DevotionalSchema.index({ title: 'text', excerpt: 'text', tags: 'text' });

const Devotional: Model<IDevotional> = mongoose.models.Devotional || mongoose.model<IDevotional>('Devotional', DevotionalSchema);

export default Devotional;
