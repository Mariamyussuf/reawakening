import mongoose, { Schema, Model } from 'mongoose';
import { BookCategory } from './Book';

export interface IBook {
    _id: string;
    title: string;
    author: string;
    description: string;
    coverImage?: string;
    pdfUrl: string;
    fileSize: number; // In MB
    pageCount?: number;
    categories: string[]; // BookCategory[]
    tags: string[];
    publishYear?: number;
    publisher?: string;
    isbn?: string;
    language: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    featured: boolean;
    popular: boolean;
    newRelease: boolean;
    totalDownloads: number;
    totalViews: number;
    averageRating?: number;
    createdAt: Date;
    updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            maxlength: [200, 'Title cannot be more than 200 characters'],
            trim: true,
            index: 'text',
        },
        author: {
            type: String,
            required: [true, 'Please provide an author'],
            maxlength: [100, 'Author name cannot be more than 100 characters'],
            trim: true,
            index: 'text',
        },
        description: {
            type: String,
            required: [true, 'Please provide a description'],
            maxlength: [2000, 'Description cannot be more than 2000 characters'],
            trim: true,
            index: 'text',
        },
        coverImage: {
            type: String,
            default: '',
        },
        pdfUrl: {
            type: String,
            required: [true, 'Please provide a PDF URL'],
        },
        fileSize: {
            type: Number,
            required: [true, 'Please provide file size'],
            min: [0, 'File size cannot be negative'],
        },
        pageCount: {
            type: Number,
            min: [0, 'Page count cannot be negative'],
        },
        categories: [{
            type: String,
            enum: Object.values(BookCategory),
        }],
        tags: [{
            type: String,
            trim: true,
            maxlength: [30, 'Tag cannot be more than 30 characters'],
        }],
        publishYear: {
            type: Number,
            min: [1000, 'Invalid publish year'],
            max: [new Date().getFullYear() + 1, 'Invalid publish year'],
        },
        publisher: {
            type: String,
            maxlength: [100, 'Publisher name cannot be more than 100 characters'],
            trim: true,
        },
        isbn: {
            type: String,
            trim: true,
        },
        language: {
            type: String,
            default: 'en',
            maxlength: [10, 'Language code cannot be more than 10 characters'],
        },
        difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'intermediate',
        },
        featured: {
            type: Boolean,
            default: false,
        },
        popular: {
            type: Boolean,
            default: false,
        },
        newRelease: {
            type: Boolean,
            default: false,
        },
        totalDownloads: {
            type: Number,
            default: 0,
            min: [0, 'Download count cannot be negative'],
        },
        totalViews: {
            type: Number,
            default: 0,
            min: [0, 'View count cannot be negative'],
        },
        averageRating: {
            type: Number,
            min: [0, 'Rating cannot be negative'],
            max: [5, 'Rating cannot be more than 5'],
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes for search
BookSchema.index({ title: 'text', author: 'text', description: 'text', tags: 'text' });
BookSchema.index({ categories: 1 });
BookSchema.index({ featured: 1, createdAt: -1 });
BookSchema.index({ popular: 1, totalViews: -1 });
BookSchema.index({ newRelease: 1, createdAt: -1 });
BookSchema.index({ totalViews: -1 });
BookSchema.index({ totalDownloads: -1 });

const BookModel: Model<IBook> = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default BookModel;
