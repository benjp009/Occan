import React from 'react';

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
 */
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, ...props }) => {
  const webpSrc = getWebPImageUrl(src);

  // Use WebP directly since original files are deleted after conversion
  return React.createElement('img', { src: webpSrc, alt, loading: 'lazy', ...props });
};