/**
 * Script pour normaliser les noms de fichiers dans public/asset/
 *
 * Convention cible:
 * - Logo: [foldername_lowercase]_logo.[ext]
 * - Assets: [foldername_lowercase]-1.[ext], -2, -3
 *
 * Usage:
 *   node scripts/normalize-assets.cjs          # Dry run (affiche les changements)
 *   node scripts/normalize-assets.cjs --run    # Exécute les renommages
 */

const fs = require('fs');
const path = require('path');

const ASSET_DIR = path.join(__dirname, '..', 'public', 'asset');
const DRY_RUN = !process.argv.includes('--run');

if (DRY_RUN) {
  console.log('🔍 Mode DRY RUN - Aucun fichier ne sera modifié');
  console.log('   Utilisez --run pour exécuter les renommages\n');
}

// Extensions d'images supportées
const IMAGE_EXTENSIONS = ['.webp', '.svg', '.png', '.jpg', '.jpeg', '.avif', '.gif'];

// Détecte si un fichier est un logo
function isLogoFile(filename) {
  const lower = filename.toLowerCase();
  return lower.includes('logo');
}

// Détecte le numéro d'asset (1, 2, ou 3)
function getAssetNumber(filename) {
  const lower = filename.toLowerCase();
  // Patterns: -1, -2, -3, _1, _2, _3, ou juste 1, 2, 3 à la fin avant l'extension
  const match = lower.match(/[-_]?([123])(?:\.[a-z]+)?$/);
  if (match) return match[1];

  // Pattern: asset-1, asset_1, etc.
  const assetMatch = lower.match(/asset[-_]?([123])/);
  if (assetMatch) return assetMatch[1];

  return null;
}

// Génère le nouveau nom de fichier
function getNewFilename(folderName, type, extension) {
  const baseName = folderName.toLowerCase().replace(/\s+/g, '').replace(/[-_]/g, '');

  if (type === 'logo') {
    return `${baseName}_logo${extension}`;
  } else {
    return `${baseName}-${type}${extension}`;
  }
}

// Traite un dossier
function processFolder(folderPath, folderName) {
  const files = fs.readdirSync(folderPath);
  const renames = [];

  // Trier les fichiers pour traiter les logos en premier
  const imageFiles = files.filter(f => {
    const ext = path.extname(f).toLowerCase();
    return IMAGE_EXTENSIONS.includes(ext) && !f.startsWith('.');
  });

  // Identifier chaque fichier
  const identified = {
    logo: null,
    asset1: null,
    asset2: null,
    asset3: null,
    unknown: []
  };

  for (const file of imageFiles) {
    const ext = path.extname(file).toLowerCase();

    if (isLogoFile(file)) {
      if (!identified.logo) {
        identified.logo = { file, ext };
      }
    } else {
      const num = getAssetNumber(file);
      if (num === '1' && !identified.asset1) {
        identified.asset1 = { file, ext };
      } else if (num === '2' && !identified.asset2) {
        identified.asset2 = { file, ext };
      } else if (num === '3' && !identified.asset3) {
        identified.asset3 = { file, ext };
      } else {
        identified.unknown.push({ file, ext });
      }
    }
  }

  // Générer les renommages
  if (identified.logo) {
    const newName = getNewFilename(folderName, 'logo', identified.logo.ext);
    if (identified.logo.file !== newName) {
      renames.push({
        old: identified.logo.file,
        new: newName,
        type: 'logo'
      });
    }
  }

  for (let i = 1; i <= 3; i++) {
    const asset = identified[`asset${i}`];
    if (asset) {
      const newName = getNewFilename(folderName, i.toString(), asset.ext);
      if (asset.file !== newName) {
        renames.push({
          old: asset.file,
          new: newName,
          type: `asset-${i}`
        });
      }
    }
  }

  // Traiter les fichiers non identifiés (essayer de les numéroter)
  let nextNum = 1;
  for (const item of identified.unknown) {
    // Trouver le prochain numéro disponible
    while (nextNum <= 3 && identified[`asset${nextNum}`]) {
      nextNum++;
    }
    if (nextNum <= 3) {
      const newName = getNewFilename(folderName, nextNum.toString(), item.ext);
      renames.push({
        old: item.file,
        new: newName,
        type: `asset-${nextNum} (auto)`
      });
      identified[`asset${nextNum}`] = item;
      nextNum++;
    }
  }

  return renames;
}

// Main
function main() {
  console.log(`📁 Dossier: ${ASSET_DIR}\n`);

  const folders = fs.readdirSync(ASSET_DIR).filter(f => {
    const fullPath = path.join(ASSET_DIR, f);
    return fs.statSync(fullPath).isDirectory() && !f.startsWith('.');
  });

  let totalRenames = 0;
  let foldersWithChanges = 0;

  for (const folder of folders) {
    const folderPath = path.join(ASSET_DIR, folder);
    const renames = processFolder(folderPath, folder);

    if (renames.length > 0) {
      foldersWithChanges++;
      console.log(`\n📂 ${folder}/`);

      for (const rename of renames) {
        const oldPath = path.join(folderPath, rename.old);
        const newPath = path.join(folderPath, rename.new);

        console.log(`   ${rename.type.padEnd(12)} ${rename.old}`);
        console.log(`   ${'→'.padEnd(12)} ${rename.new}`);

        if (!DRY_RUN) {
          try {
            // Vérifier si le fichier cible existe déjà
            if (fs.existsSync(newPath) && rename.old !== rename.new) {
              console.log(`   ⚠️  Fichier cible existe déjà, ignoré`);
              continue;
            }
            fs.renameSync(oldPath, newPath);
            console.log(`   ✅ Renommé`);
          } catch (err) {
            console.log(`   ❌ Erreur: ${err.message}`);
          }
        }

        totalRenames++;
      }
    }
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`📊 Résumé:`);
  console.log(`   Dossiers analysés: ${folders.length}`);
  console.log(`   Dossiers avec changements: ${foldersWithChanges}`);
  console.log(`   Fichiers à renommer: ${totalRenames}`);

  if (DRY_RUN && totalRenames > 0) {
    console.log(`\n💡 Exécutez avec --run pour appliquer les changements:`);
    console.log(`   node scripts/normalize-assets.cjs --run`);
  }
}

main();
