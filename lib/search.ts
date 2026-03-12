import type { GhostPost } from '@/lib/types'

/** Debounce delay for search input (ms). */
export const SEARCH_DEBOUNCE_MS = 300

/**
 * Fetch posts matching `query` from the internal search Route Handler.
 * Returns an empty array on any network/parse failure.
 */
export async function searchPosts(query: string): Promise<GhostPost[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  try {
    const res = await fetch(
      `/api/search?q=${encodeURIComponent(trimmed)}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = (await res.json()) as { posts: GhostPost[] }
    return data.posts ?? []
  } catch {
    return []
  }
}

/**
 * Wrap occurrences of `query` in `text` with `<mark>` tags.
 *
 * Safety: this function only ever outputs `<mark>` and `</mark>` tags
 * around plain text substrings. The original text content is never treated
 * as HTML — it is escaped before injection into dangerouslySetInnerHTML.
 *
 * @param text   - Plain text to search within (e.g. article title or excerpt)
 * @param query  - Search term to highlight
 * @returns      - HTML string with matching substrings wrapped in <mark>
 */
export function highlightMatch(text: string, query: string): string {
  if (!query.trim() || !text) return escapeHtml(text)

  // Escape the source text first to prevent XSS, then match the query term.
  // The query is also regex-escaped so special chars don't break the pattern.
  const escapedText = escapeHtml(text)
  const escapedQuery = escapeHtml(query.trim()).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  return escapedText.replace(
    new RegExp(`(${escapedQuery})`, 'gi'),
    '<mark>$1</mark>'
  )
}

/** Escape HTML special characters to prevent XSS. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
