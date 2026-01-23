import React, { useState, useEffect } from 'react';

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
 * Convertit les URLs d'images PNG/JPEG vers WebP si disponible
 * @param imageUrl - URL de l'image originale
 * @returns URL de l'image WebP ou originale
 */
export function getWebPImageUrl(imageUrl: string): string {
  if (!imageUrl) return imageUrl;

  // Vérifier si l'URL contient une extension d'image supportée
  const supportedExtensions = ['.png', '.jpg', '.jpeg'];
  const hasValidExtension = supportedExtensions.some(ext =>
    imageUrl.toLowerCase().includes(ext)
  );

  if (!hasValidExtension) return imageUrl;

  // Remplacer l'extension par .webp
  return imageUrl.replace(/\.(png|jpe?g)$/i, '.webp');
}

/**
 * Composant Image avec fallback WebP automatique
 * Essaie d'abord WebP, puis fallback vers le format original si 404
 */
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src ? getWebPImageUrl(src) : '');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src ? getWebPImageUrl(src) : '');
    setHasError(false);
  }, [src]);

  const handleError = () => {
    // Si WebP échoue, fallback vers la source originale
    if (!hasError && src && imgSrc !== src) {
      setHasError(true);
      setImgSrc(src);
    }
  };

  return React.createElement('img', {
    src: imgSrc,
    alt,
    loading: 'lazy',
    onError: handleError,
    ...props
  });
};