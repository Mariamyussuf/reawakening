/**
 * Sync Schema to Turso
 * 
 * This script syncs your local SQLite schema to Turso.
 * Run with: node scripts/sync-to-turso.js
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Syncing schema to Turso...\n');

// Check if Turso CLI is installed
try {
    execSync('turso --version', { stdio: 'ignore' });
} catch (error) {
    console.error('❌ Turso CLI not found. Please install it first:');
    console.error('   PowerShell: irm get.tur.so/install.ps1 | iex');
    process.exit(1);
}

// Check if dev.db exists
if (!fs.existsSync('./dev.db')) {
    console.error('❌ Local database (dev.db) not found.');
    console.error('   Run: npx prisma db push');
    process.exit(1);
}

try {
    // Get the SQL schema from local database
    console.log('📦 Extracting schema from local database...');
    const schema = execSync('sqlite3 dev.db .schema', { encoding: 'utf-8' });

    // Save to temp file
    fs.writeFileSync('./temp-schema.sql', schema);
    console.log('✅ Schema extracted\n');

    // Apply to Turso
    console.log('☁️  Applying schema to Turso...');
    console.log('   Database: reawakening\n');

    // Execute the schema on Turso
    execSync('turso db shell reawakening < temp-schema.sql', {
        stdio: 'inherit',
        shell: 'powershell.exe'
    });

    // Clean up
    fs.unlinkSync('./temp-schema.sql');

    console.log('\n✅ Schema synced to Turso successfully!');
    console.log('\n📊 Verify with: turso db shell reawakening');
    console.log('   Then run: .tables');

} catch (error) {
    console.error('\n❌ Error syncing to Turso:', error.message);
    console.error('\nTry manually:');
    console.error('1. sqlite3 dev.db .schema > schema.sql');
    console.error('2. turso db shell reawakening < schema.sql');
    process.exit(1);
}
