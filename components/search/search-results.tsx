'use client'

import Link from 'next/link'
import type { GhostPost } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { highlightMatch } from '@/lib/search'

interface SearchResultsProps {
  results: GhostPost[]
  query: string
  loading: boolean
}

/** Skeleton row shown while search is in-flight. */
function SkeletonRow() {
  return (
    <div className="flex animate-pulse flex-col gap-2 border-b border-border px-4 py-4 last:border-b-0">
      <div className="h-4 w-3/4 rounded bg-surface" />
      <div className="h-3 w-full rounded bg-surface" />
      <div className="h-3 w-5/6 rounded bg-surface" />
    </div>
  )
}

/**
 * Renders highlighted text using dangerouslySetInnerHTML.
 *
 * Safety: `highlightMatch` escapes all HTML in the source text before
 * wrapping matches in <mark>. The only tags ever emitted are <mark> and
 * </mark> — no raw user or CMS HTML is injected here.
 */
function HighlightedText({
  text,
  query,
  className,
}: {
  text: string
  query: string
  className?: string
}) {
  return (
    <span
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: highlightMatch(text, query) }}
    />
  )
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function SearchResults({ results, query, loading }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="mt-2 overflow-hidden rounded-lg border border-border bg-white">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    )
  }

  if (!query.trim()) return null

  if (results.length === 0) {
    return (
      <div className="mt-2 rounded-lg border border-border bg-white px-4 py-8 text-center">
        <p className="text-sm text-text-muted">
          No results for <strong>&ldquo;{query}&rdquo;</strong>
        </p>
        <p className="mt-1 text-xs text-text-caption">Try a different keyword or phrase.</p>
      </div>
    )
  }

  return (
    <ul
      className="mt-2 overflow-hidden rounded-lg border border-border bg-white"
      role="listbox"
      aria-label="Search results"
    >
      {results.map((post) => {
        const excerpt = post.custom_excerpt ?? post.excerpt ?? ''
        const categoryName = post.primary_tag?.name ?? null

        return (
          <li key={post.id} role="option" aria-selected={false}>
            <Link
              href={`/${post.slug}`}
              className="flex flex-col gap-1 border-b border-border px-4 py-4 transition-colors duration-150 hover:bg-surface last:border-b-0 focus:bg-surface focus:outline-none"
            >
              {/* Title with match highlight */}
              <span className="text-sm font-semibold leading-snug text-text-headline">
                <HighlightedText text={post.title} query={query} />
              </span>

              {/* Excerpt with match highlight */}
              {excerpt && (
                <span className="line-clamp-2 text-xs leading-relaxed text-text-muted">
                  <HighlightedText text={excerpt} query={query} />
                </span>
              )}

              {/* Category badge + date */}
              <div className="mt-1 flex items-center gap-2">
                {categoryName && (
                  <Badge variant="default" size="sm">
                    {categoryName}
                  </Badge>
                )}
                {post.published_at && (
                  <span className="text-[10px] text-text-caption">
                    {formatDate(post.published_at)}
                  </span>
                )}
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
