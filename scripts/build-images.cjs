/**
 * Build-time WebP Image Conversion Script
 *
 * Converts PNG/JPG images to WebP format without replacing originals.
 * Uses MD5 content hashing for cache invalidation (reliable in CI/CD).
 *
 * Output: .cache/webp/ (gitignored)
 * Manifest: .cache/image-manifest.json
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const SOURCE_DIR = path.join(__dirname, '..', 'public', 'posts', 'images');
const CACHE_DIR = path.join(__dirname, '..', '.cache', 'webp');
const MANIFEST_PATH = path.join(__dirname, '..', '.cache', 'image-manifest.json');
const QUALITY = 80;
const MAX_CONCURRENT = 4; // Limit concurrent conversions

/**
 * Compute MD5 hash of file content
 */
function getFileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Load existing manifest or return empty object
 */
function loadManifest() {
  try {
    if (fs.existsSync(MANIFEST_PATH)) {
      return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    }
  } catch (error) {
    console.log('⚠️  Could not load manifest, starting fresh');
  }
  return {};
}

/**
 * Save manifest to disk
 */
function saveManifest(manifest) {
  const cacheDir = path.dirname(MANIFEST_PATH);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

/**
 * Convert a single image to WebP
 */
async function convertImage(sourcePath, outputPath) {
  await sharp(sourcePath)
    .webp({ quality: QUALITY })
    .toFile(outputPath);
}

/**
 * Process images with concurrency limit
 */
async function processWithConcurrency(tasks, limit) {
  const results = [];
  const executing = [];

  for (const task of tasks) {
    const p = task().then(result => {
      executing.splice(executing.indexOf(p), 1);
      return result;
    });
    results.push(p);
    executing.push(p);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

/**
 * Main conversion function
 */
async function buildImages() {
  console.log('🖼️  Build-time WebP conversion starting...\n');

  // Check source directory exists
  if (!fs.existsSync(SOURCE_DIR)) {
    console.log(`⚠️  Source directory not found: ${SOURCE_DIR}`);
    return;
  }

  // Ensure cache directory exists
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  // Load existing manifest
  const manifest = loadManifest();

  // Find all PNG/JPG files
  const files = fs.readdirSync(SOURCE_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg'].includes(ext);
  });

  if (files.length === 0) {
    console.log('No PNG/JPG images found in source directory');
    return;
  }

  console.log(`Found ${files.length} images to process\n`);

  let converted = 0;
  let skipped = 0;
  let errors = 0;

  // Build conversion tasks
  const tasks = files.map(file => async () => {
    const sourcePath = path.join(SOURCE_DIR, file);
    const baseName = path.basename(file, path.extname(file));
    const webpName = `${baseName}.webp`;
    const outputPath = path.join(CACHE_DIR, webpName);
    const relativeSource = `posts/images/${file}`;

    try {
      // Compute hash of source file
      const hash = getFileHash(sourcePath);

      // Check if already converted with same hash
      const cached = manifest[relativeSource];
      if (cached && cached.hash === hash && fs.existsSync(outputPath)) {
        console.log(`⏭️  Cache hit: ${file}`);
        skipped++;
        return;
      }

      // Convert image
      await convertImage(sourcePath, outputPath);

      // Update manifest
      manifest[relativeSource] = {
        hash,
        webp: webpName,
        convertedAt: new Date().toISOString()
      };

      // Get file sizes for reporting
      const sourceSize = fs.statSync(sourcePath).size;
      const webpSize = fs.statSync(outputPath).size;
      const savings = Math.round((1 - webpSize / sourceSize) * 100);

      console.log(`✅ Converted: ${file} → ${webpName} (${savings}% smaller)`);
      converted++;

    } catch (error) {
      console.error(`❌ Error converting ${file}:`, error.message);
      errors++;
    }
  });

  // Process with concurrency limit
  await processWithConcurrency(tasks, MAX_CONCURRENT);

  // Save updated manifest
  saveManifest(manifest);

  // Summary
  console.log('\n📊 Summary:');
  console.log(`   Converted: ${converted}`);
  console.log(`   Skipped (cached): ${skipped}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total: ${files.length}`);
  console.log('\n✨ WebP conversion complete!');
}

// Run if called directly
if (require.main === module) {
  buildImages().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { buildImages };
