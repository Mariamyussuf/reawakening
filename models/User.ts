import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    campus?: string;
    bio?: string;
    avatar?: string;
    role: 'member' | 'admin' | 'leader';
    joinDate: Date;
    streak: number;
    totalVerses: number;
    completedCourses: number;
    notifications: {
        dailyVerse: boolean;
        eventReminders: boolean;
        prayerRequests: boolean;
        weeklyDigest: boolean;
    };
    privacy: {
        showProfile: boolean;
        showActivity: boolean;
        allowMessages: boolean;
    };
    lastActive: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            maxlength: [60, 'Name cannot be more than 60 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't return password by default
        },
        phone: {
            type: String,
            default: '',
        },
        campus: {
            type: String,
            default: '',
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot be more than 500 characters'],
            default: '',
        },
        avatar: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            enum: ['member', 'admin', 'leader'],
            default: 'member',
        },
        joinDate: {
            type: Date,
            default: Date.now,
        },
        streak: {
            type: Number,
            default: 0,
        },
        totalVerses: {
            type: Number,
            default: 0,
        },
        completedCourses: {
            type: Number,
            default: 0,
        },
        notifications: {
            dailyVerse: {
                type: Boolean,
                default: true,
            },
            eventReminders: {
                type: Boolean,
                default: true,
            },
            prayerRequests: {
                type: Boolean,
                default: false,
            },
            weeklyDigest: {
                type: Boolean,
                default: true,
            },
        },
        privacy: {
            showProfile: {
                type: Boolean,
                default: true,
            },
            showActivity: {
                type: Boolean,
                default: true,
            },
            allowMessages: {
                type: Boolean,
                default: true,
            },
        },
        lastActive: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
