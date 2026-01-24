import React, { useState } from 'react';

/**
 * Retourne l'URL correcte pour une icône de catégorie
 * Si l'icône est déjà une URL complète, la retourne telle quelle
 * Sinon, ajoute le préfixe /icons/
 */
export function getCategoryIconUrl(icon: string): string {
  if (!icon) return '';
  if (icon.startsWith('http://') || icon.startsWith('https://')) {
    return icon;
  }
  return `/icons/${icon}`;
}

/**
 * Génère les chemins locaux pour les assets d'une entreprise
 * Retourne un tableau de chemins possibles avec différentes extensions
 * @param companyName - Nom de l'entreprise
 * @param type - Type d'asset: 'logo' | 'asset_1' | 'asset_2' | 'asset_3'
 */
export function getLocalAssetPaths(companyName: string, type: 'logo' | 'asset_1' | 'asset_2' | 'asset_3' = 'logo'): string[] {
  if (!companyName) return [];
  // Nom en minuscules sans espaces pour le fichier
  const nameLower = companyName.toLowerCase().replace(/\s+/g, '').replace(/[-_]/g, '');
  const extensions = ['webp', 'svg', 'png', 'jpg'];

  if (type === 'logo') {
    // Pattern: /asset/[CompanyName]/[companyname]_logo.[ext]
    return extensions.map(ext => `/asset/${companyName}/${nameLower}_logo.${ext}`);
  } else {
    // Pattern: /asset/[CompanyName]/[companyname]-[1|2|3].[ext]
    const num = type.replace('asset_', '');
    return extensions.map(ext => `/asset/${companyName}/${nameLower}-${num}.${ext}`);
  }
}

/**
 * Génère le chemin local pour les assets d'une entreprise (premier chemin - webp)
 * @deprecated Utiliser getLocalAssetPaths pour supporter plusieurs extensions
 */
export function getLocalAssetPath(companyName: string, type: 'logo' | 'asset_1' | 'asset_2' | 'asset_3' = 'logo'): string {
  const paths = getLocalAssetPaths(companyName, type);
  return paths[0] || '';
}

/**
 * NOTE: WebP conversion removed - Strapi CMS already serves optimized WebP images.
 * URLs like "..._png_b4946ad5b3.webp" are already in WebP format.
 * Client-side conversion was redundant and caused 404 errors when regex didn't match.
 * See council analysis: 2026-01-24
 */

/**
 * Composant Image optimisé avec lazy loading, gestion d'erreurs et fallbacks multiples
 * 1. Essaie d'abord src (Strapi URL)
 * 2. Si erreur, essaie les fallbacks en séquence (différentes extensions)
 * 3. Si tout échoue, cache l'image
 */
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  fallbackSrcs?: string[];
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, fallbackSrc, fallbackSrcs, ...props }) => {
  // Construire la liste des sources à essayer
  const allFallbacks = React.useMemo(() => {
    const fallbacks: string[] = [];
    if (fallbackSrc) fallbacks.push(fallbackSrc);
    if (fallbackSrcs) fallbacks.push(...fallbackSrcs);
    return fallbacks;
  }, [fallbackSrc, fallbackSrcs]);

  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbackIndex, setFallbackIndex] = useState(-1);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    const nextIndex = fallbackIndex + 1;
    if (nextIndex < allFallbacks.length) {
      // Essayer le prochain fallback
      setCurrentSrc(allFallbacks[nextIndex]);
      setFallbackIndex(nextIndex);
    } else {
      // Plus de fallback, cacher l'image
      setHasError(true);
    }
  };

  // Reset state when src changes
  React.useEffect(() => {
    setCurrentSrc(src);
    setFallbackIndex(-1);
    setHasError(false);
  }, [src]);

  // Cache les images cassées ou sans source
  if (hasError || !currentSrc) {
    return null;
  }

  return React.createElement('img', {
    src: currentSrc,
    alt,
    loading: 'lazy',
    onError: handleError,
    ...props
  });
};