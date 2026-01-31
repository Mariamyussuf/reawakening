import mongoose, { Schema, Model } from 'mongoose';

export interface IPrayer {
    _id: string;
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    category?: string;
    isAnonymous: boolean;
    isAnswered: boolean;
    answeredDate?: Date;
    prayerCount: number;
    prayedBy: mongoose.Types.ObjectId[]; // Users who have prayed for this
    createdAt: Date;
    updatedAt: Date;
}

const PrayerSchema = new Schema<IPrayer>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Prayer must belong to a user'],
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            maxlength: [100, 'Title cannot be more than 100 characters'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide a description'],
            maxlength: [1000, 'Description cannot be more than 1000 characters'],
            trim: true,
        },
        category: {
            type: String,
            default: 'general',
            enum: ['general', 'health', 'family', 'finances', 'career', 'education', 'spiritual', 'other'],
        },
        isAnonymous: {
            type: Boolean,
            default: false,
        },
        isAnswered: {
            type: Boolean,
            default: false,
        },
        answeredDate: {
            type: Date,
        },
        prayerCount: {
            type: Number,
            default: 0,
        },
        prayedBy: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
    },
    {
        timestamps: true,
    }
);

// Create indexes
PrayerSchema.index({ userId: 1, createdAt: -1 });
PrayerSchema.index({ isAnswered: 1, createdAt: -1 });
PrayerSchema.index({ prayerCount: -1 });

const Prayer: Model<IPrayer> = mongoose.models.Prayer || mongoose.model<IPrayer>('Prayer', PrayerSchema);

export default Prayer;
