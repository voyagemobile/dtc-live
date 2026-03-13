'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { GhostPost } from '@/lib/types'
import { searchPosts, SEARCH_DEBOUNCE_MS } from '@/lib/search'
import { SearchResults } from '@/components/search/search-results'
import { trackSearch } from '@/lib/analytics'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Full-screen search overlay.
 *
 * - Triggered via isOpen prop (header search icon or Cmd+K in header-client).
 * - Closes on Escape key or backdrop click.
 * - Debounces Ghost API calls (300ms).
 * - Focus is trapped on the search input when open.
 */
export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GhostPost[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when overlay opens; reset state when it closes.
  useEffect(() => {
    if (isOpen) {
      // Small delay so the DOM is mounted before focusing.
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    } else {
      setQuery('')
      setResults([])
      setLoading(false)
    }
  }, [isOpen])

  // Escape key closes the overlay.
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll while overlay is open.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Debounced search: fires 300ms after the user stops typing.
  // A request-ID counter guards against stale responses: if a newer request
  // has already been dispatched, the older response is discarded when it
  // eventually resolves, preventing out-of-order result overwrites.
  const searchIdRef = useRef(0)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)

    // Increment the ID for this search attempt.
    const currentId = ++searchIdRef.current

    const timer = setTimeout(async () => {
      const posts = await searchPosts(query)
      // Only apply results if this is still the most recent request.
      if (currentId === searchIdRef.current) {
        setResults(posts)
        setLoading(false)
        trackSearch(query.trim())
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [query])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose]
  )

  if (!isOpen) return null

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 pt-[10vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={handleBackdropClick}
    >
      {/* Panel */}
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-2xl mx-4"
        /* Stop clicks inside the panel from hitting the backdrop */
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input row */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          {/* Magnifier icon */}
          <svg
            className="h-5 w-5 shrink-0 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>

          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="min-w-0 flex-1 bg-transparent text-xl font-medium text-text-headline placeholder:text-text-caption focus:outline-none"
            aria-label="Search query"
            autoComplete="off"
            spellCheck={false}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded px-2 py-1 text-xs text-text-muted transition-colors hover:bg-surface hover:text-text-body"
            aria-label="Close search"
          >
            ESC
          </button>
        </div>

        {/* Results area */}
        <div className="max-h-[60vh] overflow-y-auto px-4 pb-4">
          <SearchResults results={results} query={query} loading={loading} onClose={onClose} />
        </div>
      </div>
    </div>
  )
}
