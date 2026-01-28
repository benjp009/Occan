/**
 * Post-build WebP Copy Script
 *
 * Copies converted WebP files from .cache/webp/ to build/posts/images/
 * Run this after react-scripts build completes.
 */

const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, '..', '.cache', 'webp');
const BUILD_DIR = path.join(__dirname, '..', 'build', 'posts', 'images');

async function copyWebpFiles() {
  console.log('📋 Copying WebP files to build output...\n');

  // Check cache directory exists
  if (!fs.existsSync(CACHE_DIR)) {
    console.log('⚠️  No cache directory found. Run build-images.cjs first.');
    return;
  }

  // Ensure build output directory exists
  if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR, { recursive: true });
  }

  // Get all WebP files from cache
  const webpFiles = fs.readdirSync(CACHE_DIR).filter(file =>
    file.endsWith('.webp')
  );

  if (webpFiles.length === 0) {
    console.log('No WebP files to copy');
    return;
  }

  let copied = 0;
  let errors = 0;

  for (const file of webpFiles) {
    const sourcePath = path.join(CACHE_DIR, file);
    const destPath = path.join(BUILD_DIR, file);

    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied: ${file}`);
      copied++;
    } catch (error) {
      console.error(`❌ Error copying ${file}:`, error.message);
      errors++;
    }
  }

  console.log(`\n📊 Copied ${copied} WebP files to build/posts/images/`);
  if (errors > 0) {
    console.log(`   Errors: ${errors}`);
  }
  console.log('✨ Done!');
}

// Run if called directly
if (require.main === module) {
  copyWebpFiles().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { copyWebpFiles };
