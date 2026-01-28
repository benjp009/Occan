import React, { useState } from 'react';
import { getWebpPath, isConvertibleImage } from './getWebpPath';

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
  // Convert .png to .webp since icons are stored as .webp
  const iconFile = icon.replace(/\.png$/, '.webp');
  return `/icons/${iconFile}`;
}

/**
 * Génère les chemins locaux pour les assets d'une entreprise
 * Retourne un tableau de chemins possibles avec différentes extensions et noms de dossiers
 * @param companyName - Nom de l'entreprise
 * @param type - Type d'asset: 'logo' | 'asset_1' | 'asset_2' | 'asset_3'
 */
export function getLocalAssetPaths(companyName: string, type: 'logo' | 'asset_1' | 'asset_2' | 'asset_3' = 'logo'): string[] {
  if (!companyName) return [];
  // Nom normalisé: minuscules, sans espaces ni caractères spéciaux
  const normalized = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const extensions = ['webp', 'svg', 'png', 'jpg'];

  if (type === 'logo') {
    // Pattern: /asset/[normalized]/[normalized]_logo.[ext]
    return extensions.map(ext => `/asset/${normalized}/${normalized}_logo.${ext}`);
  } else {
    // Pattern: /asset/[normalized]/[normalized]-[1|2|3].[ext]
    const num = type.replace('asset_', '');
    return extensions.map(ext => `/asset/${normalized}/${normalized}-${num}.${ext}`);
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
 * Retourne la source du logo pour une entreprise
 * Retourne simplement l'URL du logo telle quelle
 */
export function getCompanyLogoSrc(logo: string | undefined): string {
  return logo || '';
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

/**
 * Composant Picture optimisé pour les images de blog
 * Utilise <picture> avec WebP source et fallback JPG/PNG
 * Le navigateur gère automatiquement le fallback si WebP n'est pas disponible
 */
interface OptimizedPictureProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const OptimizedPicture: React.FC<OptimizedPictureProps> = ({ src, alt, ...props }) => {
  const [hasError, setHasError] = useState(false);

  // Reset state when src changes
  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  // Hide if source is empty or all sources failed
  if (hasError || !src) {
    return null;
  }

  // Check if this is a convertible image (PNG/JPG)
  const canUseWebp = isConvertibleImage(src);
  const webpSrc = canUseWebp ? getWebpPath(src) : null;

  // If not a convertible format, use standard img
  if (!canUseWebp) {
    return React.createElement('img', {
      src,
      alt,
      loading: 'lazy',
      onError: () => setHasError(true),
      ...props
    });
  }

  // Use <picture> element with WebP source and fallback
  // Browser automatically falls back to <img> if WebP source fails
  return React.createElement('picture', null,
    React.createElement('source', {
      srcSet: webpSrc,
      type: 'image/webp'
    }),
    React.createElement('img', {
      src,
      alt,
      loading: 'lazy',
      onError: () => setHasError(true),
      ...props
    })
  );
};