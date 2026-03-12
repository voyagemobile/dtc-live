import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

/**
 * Numbered pagination component for category/tag pages.
 *
 * Renders: Previous | 1 2 3 ... N | Next
 * Active page is highlighted with text-primary (hot pink).
 * Uses <Link> for client-side navigation. URL: `${basePath}?page=${n}`.
 *
 * Shows at most 7 page slots with ellipsis for large page counts.
 */
export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  function pageUrl(page: number) {
    if (page === 1) return basePath
    return `${basePath}?page=${page}`
  }

  // Build the list of page tokens to render (numbers or '...')
  function buildPageTokens(): (number | '...')[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const tokens: (number | '...')[] = []

    // Always show first page
    tokens.push(1)

    if (currentPage > 3) {
      tokens.push('...')
    }

    // Pages around current
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      tokens.push(i)
    }

    if (currentPage < totalPages - 2) {
      tokens.push('...')
    }

    // Always show last page
    tokens.push(totalPages)

    return tokens
  }

  const tokens = buildPageTokens()
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  const linkBase =
    'inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md px-2 text-sm font-medium transition-colors duration-150'
  const activeStyles = 'bg-primary text-white'
  const inactiveStyles =
    'text-text-muted hover:bg-surface hover:text-text-headline'
  const disabledStyles = 'pointer-events-none opacity-40 text-text-caption'

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      {/* Previous */}
      {hasPrev ? (
        <Link
          href={pageUrl(currentPage - 1)}
          className={`${linkBase} ${inactiveStyles} gap-1 px-3`}
          aria-label="Go to previous page"
        >
          <span aria-hidden="true">&lsaquo;</span>
          <span className="hidden sm:inline">Prev</span>
        </Link>
      ) : (
        <span
          className={`${linkBase} ${disabledStyles} gap-1 px-3`}
          aria-disabled="true"
          aria-label="Previous page (unavailable)"
        >
          <span aria-hidden="true">&lsaquo;</span>
          <span className="hidden sm:inline">Prev</span>
        </span>
      )}

      {/* Page numbers */}
      {tokens.map((token, index) => {
        if (token === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className={`${linkBase} ${disabledStyles}`}
              aria-hidden="true"
            >
              &hellip;
            </span>
          )
        }

        const isActive = token === currentPage
        return (
          <Link
            key={token}
            href={pageUrl(token)}
            className={`${linkBase} ${isActive ? activeStyles : inactiveStyles}`}
            aria-label={`Page ${token}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {token}
          </Link>
        )
      })}

      {/* Next */}
      {hasNext ? (
        <Link
          href={pageUrl(currentPage + 1)}
          className={`${linkBase} ${inactiveStyles} gap-1 px-3`}
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline">Next</span>
          <span aria-hidden="true">&rsaquo;</span>
        </Link>
      ) : (
        <span
          className={`${linkBase} ${disabledStyles} gap-1 px-3`}
          aria-disabled="true"
          aria-label="Next page (unavailable)"
        >
          <span className="hidden sm:inline">Next</span>
          <span aria-hidden="true">&rsaquo;</span>
        </span>
      )}
    </nav>
  )
}
