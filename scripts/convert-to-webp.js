const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const ASSET_DIR = path.join(__dirname, '..', 'public', 'asset');
const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');
const QUALITY = 80; // Qualité WebP (1-100)

/**
 * Convertit récursivement tous les fichiers PNG/JPEG en WebP
 * @param {string} dir - Répertoire à traiter
 */
async function convertImagesInDirectory(dir) {
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Traitement récursif des sous-dossiers
        await convertImagesInDirectory(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        
        // Conversion PNG/JPG/JPEG vers WebP
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
          const baseName = path.basename(item, ext);
          const webpPath = path.join(dir, `${baseName}.webp`);
          
          // Éviter de reconvertir si le fichier WebP existe déjà
          if (!fs.existsSync(webpPath)) {
            try {
              await sharp(fullPath)
                .webp({ quality: QUALITY })
                .toFile(webpPath);
              
              console.log(`✅ Converti: ${path.relative(process.cwd(), fullPath)} → ${path.relative(process.cwd(), webpPath)}`);
            } catch (error) {
              console.error(`❌ Erreur lors de la conversion de ${fullPath}:`, error.message);
            }
          } else {
            console.log(`⏭️  Déjà converti: ${path.relative(process.cwd(), webpPath)}`);
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ Erreur lors du traitement du répertoire ${dir}:`, error.message);
  }
}

/**
 * Script principal
 */
async function main() {
  console.log('🚀 Début de la conversion PNG/JPEG → WebP\n');
  
  // Conversion des assets des entreprises
  if (fs.existsSync(ASSET_DIR)) {
    console.log('📁 Traitement du répertoire assets...');
    await convertImagesInDirectory(ASSET_DIR);
  } else {
    console.log('⚠️  Répertoire assets non trouvé');
  }
  
  // Conversion des icônes
  if (fs.existsSync(ICONS_DIR)) {
    console.log('\n📁 Traitement du répertoire icons...');
    await convertImagesInDirectory(ICONS_DIR);
  } else {
    console.log('⚠️  Répertoire icons non trouvé');
  }
  
  console.log('\n✨ Conversion terminée !');
}

// Exécution du script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
}

module.exports = { convertImagesInDirectory };