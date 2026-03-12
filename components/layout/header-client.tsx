'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { GhostPost } from '@/lib/types'
import type { NavCategory } from '@/components/nav/mega-menu'

const MegaMenu = dynamic(() => import('@/components/nav/mega-menu'), {
  ssr: false,
})

const MobileMenu = dynamic(() => import('@/components/nav/mobile-menu'), {
  ssr: false,
})

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
 */
export function HeaderClient({ categories, trendingPosts }: HeaderClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const openMobile = useCallback(() => setMobileOpen(true), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <>
      {/* Desktop mega menu */}
      <MegaMenu categories={categories} trendingPosts={trendingPosts} />

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
    </>
  )
}
