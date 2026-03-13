'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { GhostPost } from '@/lib/types'
import type { NavCategory } from '@/components/nav/mega-menu'

const MegaMenu = dynamic(() => import('@/components/nav/mega-menu'), {
  ssr: false,
})

const MobileMenu = dynamic(() => import('@/components/nav/mobile-menu'), {
  ssr: false,
})

const SearchOverlay = dynamic(
  () =>
    import('@/components/search/search-overlay').then((m) => ({
      default: m.SearchOverlay,
    })),
  { ssr: false }
)

interface HeaderClientProps {
  categories: NavCategory[]
  trendingPosts: GhostPost[]
}

/**
 * Client-side header shell that manages interactive navigation state.
 *
 * Renders the dynamically-imported MegaMenu (desktop) and MobileMenu (mobile),
 * along with the hamburger toggle button. Receives server-fetched trending
 * posts as serializable props from the parent Server Component.
 *
 * Also manages the full-text search overlay (triggered via search icon or Cmd+K).
 */
export function HeaderClient({ categories, trendingPosts }: HeaderClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const openMobile = useCallback(() => setMobileOpen(true), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  // Cmd+K (Mac) / Ctrl+K (Windows) keyboard shortcut to open search.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* Desktop mega menu */}
      <MegaMenu categories={categories} trendingPosts={trendingPosts} />

      {/* Search button — desktop shows "⌘K" badge, mobile shows icon only */}
      <button
        type="button"
        onClick={openSearch}
        className="inline-flex items-center gap-1.5 rounded-md p-2 text-nav-text/80 transition-colors duration-200 hover:text-nav-text"
        aria-label="Open search"
        aria-haspopup="dialog"
        aria-expanded={searchOpen}
      >
        <svg
          className="h-5 w-5"
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
        {/* Keyboard shortcut hint — visible on desktop only */}
        <span className="hidden items-center gap-0.5 rounded border border-nav-text/20 px-1.5 py-0.5 text-[10px] font-medium text-nav-text/60 md:flex">
          ⌘K
        </span>
      </button>

      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={openMobile}
        className="inline-flex items-center justify-center rounded-md p-2 text-nav-text/80 transition-colors duration-200 hover:text-nav-text md:hidden"
        aria-label="Open menu"
        aria-expanded={mobileOpen}
        aria-haspopup="dialog"
        aria-controls="mobile-nav"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Mobile overlay menu */}
      <MobileMenu
        categories={categories}
        trendingPosts={trendingPosts}
        isOpen={mobileOpen}
        onClose={closeMobile}
      />

      {/* Full-text search overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={closeSearch} />
    </>
  )
}
