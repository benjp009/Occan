/**
 * Convert an image path to its WebP equivalent
 *
 * @param originalPath - Path to PNG/JPG/JPEG image
 * @returns Path with .webp extension
 *
 * @example
 * getWebpPath('/posts/images/cover-abc.jpg') // '/posts/images/cover-abc.webp'
 * getWebpPath('/posts/images/image.png')     // '/posts/images/image.webp'
 */
export function getWebpPath(originalPath: string): string {
  if (!originalPath) return '';
  return originalPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
}

/**
 * Check if a path is a convertible image format
 */
export function isConvertibleImage(path: string): boolean {
  return /\.(png|jpg|jpeg)$/i.test(path);
}
