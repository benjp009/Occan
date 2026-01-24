import React from 'react';

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
 * NOTE: WebP conversion removed - Strapi CMS already serves optimized WebP images.
 * URLs like "..._png_b4946ad5b3.webp" are already in WebP format.
 * Client-side conversion was redundant and caused 404 errors when regex didn't match.
 * See council analysis: 2026-01-24
 */

/**
 * Composant Image optimisé avec lazy loading
 * Strapi gère déjà l'optimisation des images - pas de conversion côté client nécessaire
 */
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, ...props }) => {
  return React.createElement('img', {
    src: src || '',
    alt,
    loading: 'lazy',
    ...props
  });
};