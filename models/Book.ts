export enum BookCategory {
    THEOLOGY = "Theology & Doctrine",
    DEVOTIONAL = "Devotional & Spiritual Growth",
    BIOGRAPHY = "Biography & Testimony",
    PRAYER = "Prayer & Worship",
    LEADERSHIP = "Leadership & Ministry",
    FAMILY = "Marriage & Family",
    YOUTH = "Youth & Students",
    APOLOGETICS = "Apologetics & Defense",
    CHRISTIAN_LIVING = "Christian Living",
    BIBLE_STUDY = "Bible Study Guides",
    CHURCH_HISTORY = "Church History",
    MISSIONS = "Missions & Evangelism",
    EVANGELISM = "Evangelism & Outreach",
    DISCIPLESHIP = "Discipleship",
    WOMEN = "Women's Ministry",
    MEN = "Men's Ministry",
}

export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    coverImage?: string;

    // File info
    pdfUrl: string;
    fileSize: number; // In MB
    pageCount?: number;

    // Organization
    categories: BookCategory[];
    tags: string[];

    // Metadata
    publishYear?: number;
    publisher?: string;
    isbn?: string;
    language: string;
    difficulty: "beginner" | "intermediate" | "advanced";

    // Display
    featured: boolean;
    popular: boolean;
    newRelease: boolean;

    // Stats
    totalDownloads: number;
    totalViews: number;
    averageRating?: number;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface UserBookProgress {
    userId: string;
    bookId: string;

    // Reading state
    status: "not-started" | "reading" | "completed" | "saved";
    lastPageViewed?: number;

    // Timestamps
    startedAt?: Date;
    lastReadAt?: Date;
    completedAt?: Date;

    // User data
    bookmarked: boolean;
    rating?: number; // 1-5 stars
    review?: string;
}
