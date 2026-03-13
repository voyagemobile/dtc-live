/**
 * Custom event tracking utilities for DTC Live.
 * Wraps Vercel Analytics track() with typed, named helpers
 * so call sites never import from @vercel/analytics directly.
 */
import { track } from '@vercel/analytics'

export function trackSearch(query: string) {
  track('search', { query })
}

export function trackCategoryNav(category: string) {
  track('category_navigation', { category })
}

export function trackShare(
  method: 'copy' | 'twitter' | 'linkedin',
  articleSlug: string
) {
  track('share', { method, articleSlug })
}
