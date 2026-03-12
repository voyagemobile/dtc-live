/**
 * Format an ISO date string into a human-readable form.
 * e.g. "2026-03-12T08:00:00Z" -> "Mar 12, 2026"
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Ensure reading time is at least 1 minute.
 * Ghost returns 0 for very short posts, which looks odd as "0 min read".
 */
export function formatReadingTime(minutes: number): string {
  return `${Math.max(1, minutes)} min read`
}
