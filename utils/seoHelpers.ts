/**
 * SEO Helper Functions for texts.mom
 * Auto-generates slug, seoTitle, and seoDescription from post content
 */

/**
 * Generates a SEO-friendly slug from text
 * @param text - The input text to convert to slug
 * @param maxLength - Maximum length (default: 60)
 * @returns Lowercase slug with hyphens, special characters removed
 */
export function generateSlug(text: string, maxLength: number = 60): string {
  return text
    .toLowerCase()
    .trim()
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Remove special characters except spaces and alphanumeric
    .replace(/[^a-z0-9\s]/g, '')
    // Replace spaces with hyphens
    .replace(/\s/g, '-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit to max length
    .substring(0, maxLength)
    // Remove trailing hyphen if cut off mid-word
    .replace(/-+$/, '');
}

/**
 * Generates SEO title from message text
 * @param message - The message text
 * @param maxLength - Maximum length (default: 60)
 * @returns Trimmed title with ellipsis if needed
 */
export function generateSeoTitle(message: string, maxLength: number = 60): string {
  const trimmed = message.trim();
  
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  
  // Find the last complete word within the limit
  const truncated = trimmed.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  // If no space found or very close to start, just cut at limit
  if (lastSpaceIndex === -1 || lastSpaceIndex < maxLength * 0.7) {
    return truncated.trim() + '...';
  }
  
  // Cut at last complete word and add ellipsis
  return truncated.substring(0, lastSpaceIndex).trim() + '...';
}

/**
 * Generates SEO description from message text
 * @param message - The message text
 * @param maxLength - Maximum length (default: 155)
 * @returns Trimmed description with ellipsis if needed
 */
export function generateSeoDescription(message: string, maxLength: number = 155): string {
  const trimmed = message.trim();
  
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  
  // Find the last complete word within the limit
  const truncated = trimmed.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  // If no space found or very close to start, just cut at limit
  if (lastSpaceIndex === -1 || lastSpaceIndex < maxLength * 0.7) {
    return truncated.trim() + '...';
  }
  
  // Cut at last complete word and add ellipsis
  return truncated.substring(0, lastSpaceIndex).trim() + '...';
}

/**
 * Generates all SEO fields at once
 * @param message - The message text to generate SEO fields from
 * @returns Object with slug, seoTitle, and seoDescription
 */
export function generateSeoFields(message: string) {
  return {
    slug: generateSlug(message),
    seoTitle: generateSeoTitle(message),
    seoDescription: generateSeoDescription(message)
  };
}
