import { NotionBlock } from '../types';

const WORDS_PER_MINUTE = 200; // Average French reading speed

/**
 * Extracts plain text from NotionBlock content recursively
 */
function extractText(blocks: NotionBlock[]): string {
  let text = '';

  for (const block of blocks) {
    // Extract text from rich_text arrays in paragraph, heading, list items, etc.
    if (block.content?.rich_text) {
      text += block.content.rich_text
        .map((t: { plain_text?: string }) => t.plain_text || '')
        .join(' ');
      text += ' ';
    }

    // Handle text content directly
    if (block.content?.text) {
      text += block.content.text + ' ';
    }

    // Recurse into children
    if (block.children && block.children.length > 0) {
      text += extractText(block.children);
    }
  }

  return text;
}

/**
 * Calculates estimated reading time from NotionBlock content
 * @param content Array of NotionBlocks from blog post
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(content: NotionBlock[]): number {
  if (!content || content.length === 0) {
    return 1;
  }

  const text = extractText(content);
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

  return Math.max(1, minutes); // Minimum 1 minute
}

/**
 * Formats reading time as French string
 * @param minutes Reading time in minutes
 * @returns Formatted string like "5 min de lecture"
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min de lecture`;
}
