/**
 * Data Migration Script: MongoDB to PostgreSQL
 * 
 * This script migrates all data from MongoDB to PostgreSQL
 * Run with: node scripts/migrate-data.js
 */

const mongoose = require('mongoose');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reawakening';

// MongoDB Models (simplified for migration)
const UserSchema = new mongoose.Schema({}, { strict: false });
const PrayerSchema = new mongoose.Schema({}, { strict: false });
const JournalEntrySchema = new mongoose.Schema({}, { strict: false });
const DevotionalSchema = new mongoose.Schema({}, { strict: false });
const BookSchema = new mongoose.Schema({}, { strict: false });
const BibleBookmarkSchema = new mongoose.Schema({}, { strict: false });

const MongoUser = mongoose.model('User', UserSchema);
const MongoPrayer = mongoose.model('Prayer', PrayerSchema);
const MongoJournalEntry = mongoose.model('JournalEntry', JournalEntrySchema);
const MongoDevotional = mongoose.model('Devotional', DevotionalSchema);
const MongoBook = mongoose.model('Book', BookSchema);
const MongoBibleBookmark = mongoose.model('BibleBookmark', BibleBookmarkSchema);

// Mapping functions
const mapRole = (role) => {
    const roleMap = {
        'member': 'MEMBER',
        'admin': 'ADMIN',
        'leader': 'LEADER'
    };
    return roleMap[role] || 'MEMBER';
};

const mapPrayerCategory = (category) => {
    const categoryMap = {
        'general': 'GENERAL',
        'health': 'HEALTH',
        'family': 'FAMILY',
        'finances': 'FINANCES',
        'career': 'CAREER',
        'education': 'EDUCATION',
        'spiritual': 'SPIRITUAL',
        'other': 'OTHER'
    };
    return categoryMap[category] || 'GENERAL';
};

const mapJournalCategory = (category) => {
    const categoryMap = {
        'general': 'GENERAL',
        'morning': 'MORNING',
        'evening': 'EVENING',
        'gratitude': 'GRATITUDE',
        'answered': 'ANSWERED',
        'study': 'STUDY',
        'prayer': 'PRAYER',
        'reflection': 'REFLECTION',
        'other': 'OTHER'
    };
    return categoryMap[category] || 'GENERAL';
};

const mapMood = (mood) => {
    if (!mood) return null;
    const moodMap = {
        'grateful': 'GRATEFUL',
        'joyful': 'JOYFUL',
        'hopeful': 'HOPEFUL',
        'peaceful': 'PEACEFUL',
        'anxious': 'ANXIOUS',
        'sad': 'SAD',
        'confused': 'CONFUSED',
        'excited': 'EXCITED',
        'other': 'OTHER'
    };
    return moodMap[mood] || null;
};

const mapDevotionalStatus = (status) => {
    const statusMap = {
        'draft': 'DRAFT',
        'scheduled': 'SCHEDULED',
        'published': 'PUBLISHED'
    };
    return statusMap[status] || 'DRAFT';
};

const mapBookCategory = (category) => {
    const categoryMap = {
        'theology': 'THEOLOGY',
        'devotional': 'DEVOTIONAL',
        'biblical_studies': 'BIBLICAL_STUDIES',
        'christian_living': 'CHRISTIAN_LIVING',
        'prayer': 'PRAYER',
        'worship': 'WORSHIP',
        'discipleship': 'DISCIPLESHIP',
        'leadership': 'LEADERSHIP',
        'youth': 'YOUTH',
        'family': 'FAMILY',
        'marriage': 'MARRIAGE',
        'evangelism': 'EVANGELISM',
        'missions': 'MISSIONS',
        'church_history': 'CHURCH_HISTORY',
        'apologetics': 'APOLOGETICS',
        'biography': 'BIOGRAPHY',
        'fiction': 'FICTION',
        'childrens': 'CHILDRENS',
        'other': 'OTHER'
    };
    return categoryMap[category] || 'OTHER';
};

const mapDifficulty = (difficulty) => {
    const difficultyMap = {
        'beginner': 'BEGINNER',
        'intermediate': 'INTERMEDIATE',
        'advanced': 'ADVANCED'
    };
    return difficultyMap[difficulty] || 'INTERMEDIATE';
};

const mapHighlightColor = (color) => {
    const colorMap = {
        'yellow': 'YELLOW',
        'green': 'GREEN',
        'blue': 'BLUE',
        'pink': 'PINK',
        'purple': 'PURPLE'
    };
    return colorMap[color] || 'YELLOW';
};

// Migration functions
async function migrateUsers() {
    console.log('\n📦 Migrating Users...');
    const mongoUsers = await MongoUser.find({});
    console.log(`Found ${mongoUsers.length} users in MongoDB`);

    const userIdMap = new Map(); // Map MongoDB _id to PostgreSQL id

    for (const mongoUser of mongoUsers) {
        try {
            const prismaUser = await prisma.user.create({
                data: {
                    name: mongoUser.name,
                    email: mongoUser.email,
                    password: mongoUser.password,
                    phone: mongoUser.phone || null,
                    campus: mongoUser.campus || null,
                    bio: mongoUser.bio || null,
                    avatar: mongoUser.avatar || null,
                    role: mapRole(mongoUser.role),
                    joinDate: mongoUser.joinDate || new Date(),
                    streak: mongoUser.streak || 0,
                    totalVerses: mongoUser.totalVerses || 0,
                    completedCourses: mongoUser.completedCourses || 0,
                    lastActive: mongoUser.lastActive || new Date(),
                    dailyVerse: mongoUser.notifications?.dailyVerse ?? true,
                    eventReminders: mongoUser.notifications?.eventReminders ?? true,
                    prayerRequests: mongoUser.notifications?.prayerRequests ?? false,
                    weeklyDigest: mongoUser.notifications?.weeklyDigest ?? true,
                    showProfile: mongoUser.privacy?.showProfile ?? true,
                    showActivity: mongoUser.privacy?.showActivity ?? true,
                    allowMessages: mongoUser.privacy?.allowMessages ?? true,
                    createdAt: mongoUser.createdAt || new Date(),
                    updatedAt: mongoUser.updatedAt || new Date(),
                },
            });

            userIdMap.set(mongoUser._id.toString(), prismaUser.id);
            console.log(`✅ Migrated user: ${mongoUser.email}`);
        } catch (error) {
            console.error(`❌ Error migrating user ${mongoUser.email}:`, error.message);
        }
    }

    console.log(`✅ Migrated ${userIdMap.size} users`);
    return userIdMap;
}

async function migratePrayers(userIdMap) {
    console.log('\n📦 Migrating Prayers...');
    const mongoPrayers = await MongoPrayer.find({});
    console.log(`Found ${mongoPrayers.length} prayers in MongoDB`);

    let migrated = 0;
    for (const mongoPrayer of mongoPrayers) {
        try {
            const userId = userIdMap.get(mongoPrayer.userId?.toString());
            if (!userId) {
                console.log(`⚠️  Skipping prayer - user not found: ${mongoPrayer.userId}`);
                continue;
            }

            // Map prayedBy user IDs
            const prayedBy = (mongoPrayer.prayedBy || [])
                .map(id => userIdMap.get(id.toString()))
                .filter(Boolean);

            await prisma.prayer.create({
                data: {
                    userId,
                    title: mongoPrayer.title,
                    description: mongoPrayer.description,
                    category: mapPrayerCategory(mongoPrayer.category),
                    isAnonymous: mongoPrayer.isAnonymous || false,
                    isAnswered: mongoPrayer.isAnswered || false,
                    answeredDate: mongoPrayer.answeredDate || null,
                    prayerCount: mongoPrayer.prayerCount || 0,
                    prayedBy,
                    createdAt: mongoPrayer.createdAt || new Date(),
                    updatedAt: mongoPrayer.updatedAt || new Date(),
                },
            });

            migrated++;
        } catch (error) {
            console.error(`❌ Error migrating prayer:`, error.message);
        }
    }

    console.log(`✅ Migrated ${migrated} prayers`);
}

async function migrateJournalEntries(userIdMap) {
    console.log('\n📦 Migrating Journal Entries...');
    const mongoEntries = await MongoJournalEntry.find({});
    console.log(`Found ${mongoEntries.length} journal entries in MongoDB`);

    let migrated = 0;
    for (const mongoEntry of mongoEntries) {
        try {
            const userId = userIdMap.get(mongoEntry.userId?.toString());
            if (!userId) {
                console.log(`⚠️  Skipping journal entry - user not found: ${mongoEntry.userId}`);
                continue;
            }

            await prisma.journalEntry.create({
                data: {
                    userId,
                    title: mongoEntry.title || null,
                    content: mongoEntry.content,
                    category: mapJournalCategory(mongoEntry.category),
                    mood: mapMood(mongoEntry.mood),
                    tags: mongoEntry.tags || [],
                    createdAt: mongoEntry.createdAt || new Date(),
                    updatedAt: mongoEntry.updatedAt || new Date(),
                },
            });

            migrated++;
        } catch (error) {
            console.error(`❌ Error migrating journal entry:`, error.message);
        }
    }

    console.log(`✅ Migrated ${migrated} journal entries`);
}

async function migrateDevotionals() {
    console.log('\n📦 Migrating Devotionals...');
    const mongoDevotionals = await MongoDevotional.find({});
    console.log(`Found ${mongoDevotionals.length} devotionals in MongoDB`);

    let migrated = 0;
    for (const mongoDevotional of mongoDevotionals) {
        try {
            await prisma.devotional.create({
                data: {
                    title: mongoDevotional.title,
                    content: mongoDevotional.content,
                    excerpt: mongoDevotional.excerpt,
                    author: mongoDevotional.author,
                    coverImage: mongoDevotional.coverImage || null,
                    publishDate: mongoDevotional.publishDate || new Date(),
                    scheduledDate: mongoDevotional.scheduledDate || null,
                    status: mapDevotionalStatus(mongoDevotional.status),
                    tags: mongoDevotional.tags || [],
                    scripture: mongoDevotional.scripture || null,
                    createdAt: mongoDevotional.createdAt || new Date(),
                    updatedAt: mongoDevotional.updatedAt || new Date(),
                },
            });

            migrated++;
        } catch (error) {
            console.error(`❌ Error migrating devotional:`, error.message);
        }
    }

    console.log(`✅ Migrated ${migrated} devotionals`);
}

async function migrateBooks() {
    console.log('\n📦 Migrating Books...');
    const mongoBooks = await MongoBook.find({});
    console.log(`Found ${mongoBooks.length} books in MongoDB`);

    let migrated = 0;
    for (const mongoBook of mongoBooks) {
        try {
            // Map categories
            const categories = (mongoBook.categories || [])
                .map(cat => mapBookCategory(cat))
                .filter(Boolean);

            await prisma.book.create({
                data: {
                    title: mongoBook.title,
                    author: mongoBook.author,
                    description: mongoBook.description,
                    coverImage: mongoBook.coverImage || null,
                    pdfUrl: mongoBook.pdfUrl,
                    fileSize: mongoBook.fileSize || 0,
                    pageCount: mongoBook.pageCount || null,
                    categories,
                    tags: mongoBook.tags || [],
                    publishYear: mongoBook.publishYear || null,
                    publisher: mongoBook.publisher || null,
                    isbn: mongoBook.isbn || null,
                    language: mongoBook.language || 'en',
                    difficulty: mapDifficulty(mongoBook.difficulty),
                    featured: mongoBook.featured || false,
                    popular: mongoBook.popular || false,
                    newRelease: mongoBook.newRelease || false,
                    totalDownloads: mongoBook.totalDownloads || 0,
                    totalViews: mongoBook.totalViews || 0,
                    averageRating: mongoBook.averageRating || null,
                    createdAt: mongoBook.createdAt || new Date(),
                    updatedAt: mongoBook.updatedAt || new Date(),
                },
            });

            migrated++;
        } catch (error) {
            console.error(`❌ Error migrating book:`, error.message);
        }
    }

    console.log(`✅ Migrated ${migrated} books`);
}

async function migrateBibleBookmarks(userIdMap) {
    console.log('\n📦 Migrating Bible Bookmarks...');
    const mongoBookmarks = await MongoBibleBookmark.find({});
    console.log(`Found ${mongoBookmarks.length} bible bookmarks in MongoDB`);

    let migrated = 0;
    for (const mongoBookmark of mongoBookmarks) {
        try {
            const userId = userIdMap.get(mongoBookmark.userId?.toString());
            if (!userId) {
                console.log(`⚠️  Skipping bookmark - user not found: ${mongoBookmark.userId}`);
                continue;
            }

            await prisma.bibleBookmark.create({
                data: {
                    userId,
                    version: mongoBookmark.version || 'KJV',
                    bookId: mongoBookmark.bookId,
                    bookName: mongoBookmark.bookName,
                    chapter: mongoBookmark.chapter,
                    verse: mongoBookmark.verse || null,
                    verseText: mongoBookmark.verseText || null,
                    reference: mongoBookmark.reference,
                    note: mongoBookmark.note || null,
                    color: mapHighlightColor(mongoBookmark.color),
                    createdAt: mongoBookmark.createdAt || new Date(),
                    updatedAt: mongoBookmark.updatedAt || new Date(),
                },
            });

            migrated++;
        } catch (error) {
            console.error(`❌ Error migrating bible bookmark:`, error.message);
        }
    }

    console.log(`✅ Migrated ${migrated} bible bookmarks`);
}

// Main migration function
async function migrate() {
    console.log('🚀 Starting MongoDB to PostgreSQL Migration...\n');
    console.log('⚠️  Make sure:');
    console.log('   1. PostgreSQL is running');
    console.log('   2. Database "reawakening" exists');
    console.log('   3. Prisma migrations have been run (npx prisma migrate dev)');
    console.log('   4. MongoDB is running and accessible\n');

    try {
        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Connect to PostgreSQL (Prisma)
        console.log('📡 Connecting to PostgreSQL...');
        await prisma.$connect();
        console.log('✅ Connected to PostgreSQL\n');

        // Run migrations in order (users first, then related data)
        const userIdMap = await migrateUsers();
        await migratePrayers(userIdMap);
        await migrateJournalEntries(userIdMap);
        await migrateDevotionals();
        await migrateBooks();
        await migrateBibleBookmarks(userIdMap);

        console.log('\n✅ Migration completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Users: ${userIdMap.size}`);
        console.log(`   Prayers: ${await prisma.prayer.count()}`);
        console.log(`   Journal Entries: ${await prisma.journalEntry.count()}`);
        console.log(`   Devotionals: ${await prisma.devotional.count()}`);
        console.log(`   Books: ${await prisma.book.count()}`);
        console.log(`   Bible Bookmarks: ${await prisma.bibleBookmark.count()}`);

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        throw error;
    } finally {
        // Disconnect
        await mongoose.disconnect();
        await prisma.$disconnect();
        console.log('\n👋 Disconnected from databases');
    }
}

// Run migration
migrate()
    .then(() => {
        console.log('\n🎉 All done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Migration failed:', error);
        process.exit(1);
    });
