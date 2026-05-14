/**
 * Extracts plain text from HTML content and truncates intelligently
 * Removes all HTML tags, normalizes whitespace, and truncates at word boundaries
 */
export function extractTextPreview(htmlContent: string, maxChars: number = 200): string {
  if (!htmlContent) return ''

  // Remove HTML tags
  let text = htmlContent
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

  // Normalize whitespace
  text = text
    .replace(/\s+/g, ' ')
    .trim()

  // Truncate at word boundary
  if (text.length <= maxChars) {
    return text
  }

  // Find last space before maxChars to avoid cutting words
  const truncated = text.substring(0, maxChars)
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  if (lastSpaceIndex > maxChars * 0.7) {
    // Only use the space if it's not too far back
    return truncated.substring(0, lastSpaceIndex) + '…'
  }

  return truncated + '…'
}

/**
 * Counts estimated reading time for text content
 * Based on average reading speed of 200 words per minute
 */
export function estimateReadingTime(htmlContent: string): number {
  if (!htmlContent) return 1
  
  const text = htmlContent.replace(/<[^>]*>/g, ' ').trim()
  const words = text.split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  
  return minutes
}
