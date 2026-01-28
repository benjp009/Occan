/**
 * Build-time WebP Image Conversion Script
 *
 * Resizes and converts PNG/JPG images to WebP format without replacing originals.
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

// Processing settings - change VERSION to invalidate cache
const PROCESSING_VERSION = 2; // Increment this to force re-processing all images
const QUALITY = 80;
const MAX_WIDTH_COVER = 1600;  // Max width for cover images
const MAX_WIDTH_INLINE = 1200; // Max width for inline content images
const MAX_CONCURRENT = 4;

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
      const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
      // Invalidate cache if processing version changed
      if (manifest._version !== PROCESSING_VERSION) {
        console.log('🔄 Processing version changed, invalidating cache...\n');
        return { _version: PROCESSING_VERSION };
      }
      return manifest;
    }
  } catch (error) {
    console.log('⚠️  Could not load manifest, starting fresh');
  }
  return { _version: PROCESSING_VERSION };
}

/**
 * Save manifest to disk
 */
function saveManifest(manifest) {
  const cacheDir = path.dirname(MANIFEST_PATH);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  manifest._version = PROCESSING_VERSION;
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

/**
 * Determine max width based on filename
 * Cover images get larger max width than inline images
 */
function getMaxWidth(filename) {
  return filename.startsWith('cover-') ? MAX_WIDTH_COVER : MAX_WIDTH_INLINE;
}

/**
 * Resize and convert a single image to WebP
 */
async function convertImage(sourcePath, outputPath, maxWidth) {
  const image = sharp(sourcePath);
  const metadata = await image.metadata();

  // Only resize if image is wider than max width
  if (metadata.width > maxWidth) {
    await image
      .resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: QUALITY })
      .toFile(outputPath);
  } else {
    // Just convert to WebP without resizing
    await image
      .webp({ quality: QUALITY })
      .toFile(outputPath);
  }

  return metadata;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
  console.log('🖼️  Build-time image optimization starting...');
  console.log(`   Max width: ${MAX_WIDTH_COVER}px (covers), ${MAX_WIDTH_INLINE}px (inline)`);
  console.log(`   Quality: ${QUALITY}%\n`);

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
  let totalSaved = 0;

  // Build conversion tasks
  const tasks = files.map(file => async () => {
    const sourcePath = path.join(SOURCE_DIR, file);
    const baseName = path.basename(file, path.extname(file));
    const webpName = `${baseName}.webp`;
    const outputPath = path.join(CACHE_DIR, webpName);
    const relativeSource = `posts/images/${file}`;
    const maxWidth = getMaxWidth(file);

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

      // Get source size before conversion
      const sourceSize = fs.statSync(sourcePath).size;

      // Convert image (with resize if needed)
      const metadata = await convertImage(sourcePath, outputPath, maxWidth);

      // Get output size
      const webpSize = fs.statSync(outputPath).size;
      const savings = Math.round((1 - webpSize / sourceSize) * 100);
      totalSaved += (sourceSize - webpSize);

      // Update manifest
      manifest[relativeSource] = {
        hash,
        webp: webpName,
        originalWidth: metadata.width,
        originalHeight: metadata.height,
        maxWidth,
        convertedAt: new Date().toISOString()
      };

      // Log with size info
      const resized = metadata.width > maxWidth ? ` (resized from ${metadata.width}px)` : '';
      console.log(`✅ ${file}${resized}`);
      console.log(`   ${formatBytes(sourceSize)} → ${formatBytes(webpSize)} (${savings}% smaller)`);
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
  if (totalSaved > 0) {
    console.log(`   Total saved: ${formatBytes(totalSaved)}`);
  }
  console.log('\n✨ Image optimization complete!');
}

// Run if called directly
if (require.main === module) {
  buildImages().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { buildImages };
